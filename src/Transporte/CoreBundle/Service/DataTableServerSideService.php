<?php

namespace Transporte\CoreBundle\Service;

use Transporte\SegomBundle\Entity\Elements;
use Doctrine\ORM\Query\Expr;
use Doctrine\ORM\EntityManager;

class DataTableServerSideService
{
    private $entityManager;

    public function __construct(EntityManager $em)
    {
        $this->entityManager = $em;
    }

    public function setEntityManager(EntityManager $em)
    {
        $this->entityManager = $em;
    }

    public function getEntityManager()
    {
        return $this->entityManager;
    }

    /**
     * @param array $get
     * @param bool $flag
     * @return array|\Doctrine\ORM\Query
     */
    public function ajaxTable(array $get, $flag = false, $total = false) {

        /* Indexed column (used for fast and accurate table cardinality) */
        $alias = $get['alias'];

        /* DB table to use */
        $tableObjectName = $get['repository_name'];

        /**
         * Set to default
         */
        if (!isset($get['columns']) || empty($get['columns']))
            $get['columns'] = array('id');

        if (isset($get['join']) && !empty($get['join'])) {
            $alias_join = $get['alias_join'];
        }

        $aColumns = array();
        $sColumns = array();
        foreach ($get['columns'] as $key => $value) {
            $aColumns[$key] = $alias . '.' . $value;
            $sColumns[$key] = $alias . '.' . $value;
        }
        $as_join = $get['as_join'];
        if (isset($get['join']) && !empty($get['join'])) {
            foreach ($get['attr_join'] as $key_join => $value_attr_join) {
                $aColumns[$key_join] = $alias_join[$key_join] . '.' . $value_attr_join;
                $sColumns[$key_join] = $alias_join[$key_join] . '.' . $value_attr_join . ' as ' . $as_join[$key_join];
            }
        }

        $query_builder = $this->getEntityManager()
                ->getRepository($tableObjectName)
                ->createQueryBuilder($alias)
                ->select(str_replace(" , ", " ", implode(", ", $sColumns)));
        if (isset($get['join']) && !empty($get['join'])) {
            foreach ($get['join'] as $key_alias_join => $value_join) {
                $query_builder->leftJoin($alias . '.' . $value_join, $alias_join[$key_alias_join]);
            }
        }

        $query_builder_pag = clone($query_builder);

        /**
         * Paging
         */
        if (isset($get['iDisplayStart']) && $get['iDisplayLength'] != '-1') {
            $query_builder->setFirstResult((int) $get['iDisplayStart'])
                    ->setMaxResults((int) $get['iDisplayLength']);
        }

        /*
         * Ordering
         */
        if (isset($get['iSortCol_0'])) {
            for ($i = 0; $i < intval($get['iSortingCols']); $i++) {
                if ($get['bSortable_' . intval($get['iSortCol_' . $i])] == "true") {
                    $query_builder->orderBy($aColumns[(int) $get['iSortCol_' . $i]], $get['sSortDir_' . $i]);
                }
            }
        }

        $aLike = array();
        for ($i = 0; $i < count($aColumns); $i++) {
            if (isset($get['sSearch']) && isset($get['bSearchable_' . $i]) && $get['bSearchable_' . $i] == "true" && $get['sSearch'] != "") {
                switch($get['types'][$i]) {
                    case 'date': {
                        $aLike[] = $query_builder->expr()->like($aColumns[$i], str_replace('/','\/',$get['sSearch']));
                        break;
                    }
                    case 'integer': {
                        if (is_numeric($get['sSearch'])) {
                            $aLike[] = $query_builder->expr()->eq($aColumns[$i], $get['sSearch']);
                        }
                        break;
                    }
                    case 'string': {
                        $aLike[] = $query_builder->expr()->like("UPPER(" . $aColumns[$i] . ")", '\'%' . strtoupper($get['sSearch']) . '%\'');
                        break;
                    }
                    case 'boolean': {
                        $aLike[] = $query_builder->expr()->eq($aColumns[$i], $get['sSearch']);
                        break;
                    }
                }
            }
        }

        if (count($aLike) > 0) {
            $query_builder->andWhere(new Expr\Orx($aLike));
            $query_builder_pag->andWhere(new Expr\Orx($aLike));
        } else {
            unset($aLike);
        }

        /*
         * SQL queries
         * Get data to display
         */
        $query = $query_builder->getQuery();

        if ($total) {
            return $query_builder_pag->getQuery();
        } else {
            if ($flag) {
                return $query;
            } else {
                return $query->getResult();
            }
        }
    }

    /**
     * @return int
     */
    public function getCount($get) {
        $idName = isset($get['id_name'])? $get['id_name'] : "id";
        $query_builder = $this->getEntityManager()
                ->getRepository($get['repository_name'])
                ->createQueryBuilder('a')
                ->select("count(" . $get['alias'] . "." . $get['id_name'] .")");

        $aResultTotal = $query_builder->getQuery()->getSingleScalarResult();
        return $aResultTotal;
    }
}