<?php

namespace Transporte\UserBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Transporte\UserBundle\Form\UserType;
use Symfony\Component\HttpFoundation\Response;

use Transporte\UserBundle\Entity\User;
use Transporte\CoreBundle\Entity\Constant;

/**
 * User controller.
 *
 * @Route("/user")
 */
class UserController extends Controller
{
    /**
     * Lists all User entities.
     *
     * @Route("/", name="user_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $users = $em->getRepository('UserBundle:User')->findAll();

        return $this->render('UserBundle:User:index.html.twig', array(
            'users' => $users,
        ));
    }

    /**
     * Creates a new User entity.
     *
     * @Route("/new", name="user_new")
     * @Method({"GET", "POST"})
     */
    public function newAction(Request $request)
    {
        $user = new User();
        $form = $this->createForm('Transporte\UserBundle\Form\UserType', $user);
        $form->handleRequest($request);
        $flashBagService = $this->get('flashbag_service');

        if ($form->isSubmitted() && $form->isValid()) {
            $userManager = $this->get('fos_user.user_manager');
            $userManager->updatePassword($user);

            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();

            $this->get('configuration_service')->cloneConfiguration($user);

            $flashBagService->setFlash('success', 'La creación se ha realizado correctamente.');
            return $this->redirectToRoute('user_show', array('id' => $user->getId()));
        }

        return $this->render('UserBundle:User:new.html.twig', array(
            'user' => $user,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a User entity.
     *
     * @Route("/{id}", name="user_show")
     * @Method("GET")
     */
    public function showAction(User $user)
    {
        $deleteForm = $this->createDeleteForm($user);

        return $this->render('UserBundle:User:show.html.twig', array(
            'user' => $user,
            'delete_form' => $deleteForm->createView()
        ));
    }

    /**
     * Displays a form to edit an existing User entity.
     *
     * @Route("/{id}/edit", name="user_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, User $user)
    {
        $editForm = $this->createForm('Transporte\UserBundle\Form\UserType', $user);
        $editForm->handleRequest($request);
        $flashBagService = $this->get('flashbag_service');

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $userManager = $this->get('fos_user.user_manager');
            $userManager->updatePassword($user);

            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();

            $flashBagService->setFlash('success', 'Los cambios se han realizado correctamente.');
            return $this->redirectToRoute('user_edit', array('id' => $user->getId()));
        }

        return $this->render('UserBundle:User:edit.html.twig', array(
            'user' => $user,
            'edit_form' => $editForm->createView()
        ));
    }

    /**
     * Deletes a User entity.
     *
     * @Route("/{id}/delete", name="user_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, User $user)
    {
        $form = $this->createDeleteForm($user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($user);
            $em->flush();

            $this->get('flashbag_service')->setFlash('success', 'Usuario eliminado correctamente.');
        }

        return $this->redirectToRoute('user_index');
    }

    /**
     * Creates a form to delete a User entity.
     *
     * @param User $user The User entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(User $user)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('user_delete', array('id' => $user->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }

    /**
     * @Route(
     *    "/user/list",
     *    name="user_list"
     * )
     */
    public function listAction(Request $request)
    {
        $get = $request->query->all();

        /**
         * Ingresar todas las columnas que se van a mostrar en el listado
         * Si alguna columna no pertenece directamente a la tabla (Es una relación) ingresar el atributo que muestra el nombre de la entidad
         * El id es obligatorio si se quiere usar acciones
         */
        $select_columns = array( 0 => 'id', 1 => 'username', 2 => 'email');
        /** Ingresar las columnas que no se encuentran relacionadas con la entidad */
        $columns = array( 0 => 'id', 1 => 'username', 2 =>'email');
        /** Ingresar si se quieren ocultar columnas */
        $hideColumns = array( 0 => 'id');

        /** Ingresar los tipos de datos de las columnas. Estos se utilizaran en los filtros. Si no se ingresan no estarán para buscar
            Tipos de datos:
                - integer
                - boolean
                - date
                - string
         */
        $types = [0 => 'integer', 1 => 'string', 2 => 'string'];

        /********* Parametros para join ***************/
        /** Ingresar las relaciones de la entidad */
        $join = [];
        /** Ingresar nuevamente los atributos que muestran el nombre de las entidades que se relacionan
         * NO repetir los nombres ya que no va a funcionar
         * Si se llega a repetir un atributo, por ejemplo en la tabla Categoria y en la tabla Empleado usan
         * el mismo atributo (nombre) hay que poner el as y el nombre de la tabla al lado. Ej.: nombre as categoria
         * IMPORTANTE: Si se va a utilizar el 'as' tiene que coincidir con lo que escribiste en el $select_columns
         */
        $attr_join = [];
        /** Los nombres deben ser iguales al $select_columns */
        $as_join = [];
        /** Ingresar los alias que se van a utilizar para el join de las relaciones */
        $alias_join = [];
        /** Finaliza Relaciones de la entidad */

        $get['alias'] = 'a';
        $get['repository_name'] = "UserBundle:User";
        $get['id_name'] = "id";

        $get['columns'] = &$columns;
        $get['select_columns'] = &$select_columns;
        $get['join'] = &$join;
        $get['attr_join'] = &$attr_join;
        $get['alias_join'] = &$alias_join;
        $get['as_join'] = &$as_join;
        $get['types'] = &$types;
        $get['session'] = $this->get('session');

        $dataTableServerSideService = $this->container->get('datatable.serverside.service');

        $rResult = $dataTableServerSideService->ajaxTable($get, true)->getArrayResult();

        /* Data set length after filtering */
        $iFilteredTotal = count($dataTableServerSideService->ajaxTable($get, true, true)->getArrayResult());

        /*
         * Output
         */
        $output = array(
          "sEcho" => intval($get['sEcho']),
          "iTotalRecords" => $dataTableServerSideService->getCount($get),
          "iTotalDisplayRecords" => $iFilteredTotal,
          "aaData" => array(),
          'iTotal' => count($rResult)
        );
        foreach($rResult as $aRow)
        {
            $row = [];
            for ( $i = 0; $i<count($select_columns) ; $i++ ) {
                if (in_array($i, $hideColumns)) continue;
                if ( $select_columns[$i] == "version" ) {
                    /* Special output formatting for 'version' column */
                    $row[] = ($aRow[ $select_columns[$i] ]=="0") ? '-' : $aRow[ $select_columns[$i] ];
                } elseif ( $select_columns[$i] != ' ') {
                    if ($types[$i] == 'date') {
                        if(is_object($aRow[$select_columns[$i]])) {
                            $row[] = $aRow[$select_columns[$i]]->format('d/m/Y H:i');
                        }
                        else {
                            $row[] = "";
                        }
                    } else {
                        if (gettype($aRow[$select_columns[$i]]) == "boolean") {
                            $row[] = "<td>" . $this->renderView(":includes:_boolean.html.twig", array('boolean' => $aRow[$select_columns[$i]])) . "</td>";
                        } else {
                            $row[] = $aRow[$select_columns[$i]];
                        }
                    }
                }
            }
            $row[] = "<td>" . $this->renderView("CoreBundle:Default:table_actions.html.twig", array(
                'edit_path' => $this->generateUrl('user_edit', [$get['id_name'] => $aRow[$get['id_name']]]),
                'show_path' => $this->generateUrl('user_show', [$get['id_name'] => $aRow[$get['id_name']]])
            )) . "</td>";

            $output['aaData'][] = $row;
        }

        unset($rResult);

        return new Response(
           json_encode($output)
        );
    }

}
