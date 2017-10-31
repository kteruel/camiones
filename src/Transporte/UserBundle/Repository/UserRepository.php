<?php

namespace Transporte\UserBundle\Repository;

use Transporte\CoreBundle\Entity\Constant;

use Doctrine\ORM\Query\Expr\Join;

use Doctrine\Common\Collections\ArrayCollection;

class UserRepository extends \Doctrine\ORM\EntityRepository
{
    private function getQueryBuilderByRole($role)
    {
        $qb = $this->_em->createQueryBuilder();

        $qb
        ->select('u')
        ->from($this->_entityName, 'u')
        ->where('u.roles LIKE :roles')
        ->setParameter('roles', '%"'.$role.'"%')
        ;

        return $qb;
    }

    /**
     * @param string $role
     *
     * @return array
     */
    public function findByRole($role, $select = null)
    {
        $qb = $this->getQueryBuilderByRole($role);

        if ($select) {
            $qb->select($select);
        }
        return $qb->getQuery()->getResult();
    }

    /**
     * Obtiene usuarios a partir de los roles del usuario y de los perfiles
     */
    public function findByRoleInGroups($role)
    {
        $qb = $this->getQueryBuilderByRole($role);

        $qb
        ->join('u.groups', 'g')
        ->orWhere('g.roles LIKE :group_roles')
        ->setParameter('group_roles', '%"' . $role . '"%')
        ;

        return $qb->getQuery()->getResult();
    }

    /**
     * Obtiene el participant por id, email o username
     *
     * @param  integer|string $index
     *
     * @return User
     */
    public function findByIndex($index, $roles = null)
    {
        $qb = $this->createQueryBuilder('p');
        if (is_numeric($index)) { // Id
            $qb->where($qb->expr()->eq('p.id', ':index'));
        } else {
            $qb->where($qb->expr()->orX(
                $qb->expr()->like($qb->expr()->lower('p.email'), ':index'),
                $qb->expr()->like($qb->expr()->lower('p.username'), ':index')
            ));
        }
        $qb->setParameter('index', $index);

        if ($roles) {
            $qb
            ->andWhere('p.roles LIKE :roles')
            ->setParameter('roles', '%"'.$roles.'"%')
            ;
        }

        return $qb->getQuery()->getOneOrNullResult();
    }

    public function findByNameOrLastName($q)
    {
        $qb = $this->createQueryBuilder('p');
        $qb->where($qb->expr()->orX(
            $qb->expr()->like($qb->expr()->lower('p.name'), ':name'),
            $qb->expr()->like($qb->expr()->lower('p.lastName'), ':lastName')
        ))
        ->setParameters([
            'name' => "%" . strtolower($q) . "%",
            'lastName' => "%" . strtolower($q) . "%"
        ]);

        return $qb->getQuery()->getResult();
    }

}