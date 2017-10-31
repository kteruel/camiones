<?php

namespace Transporte\CoreBundle\Factory;

use Symfony\Component\Finder\Finder;
use Symfony\Component\Yaml\Parser;

use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class MenuFactory
{
    protected $authorizationChecker;

    public function __construct(AuthorizationCheckerInterface $authorizationChecker)
    {
        $this->authorizationChecker = $authorizationChecker;
    }

    /**
     * Contruye el menu recorriendo los archivos menu.yml de todos los bundles
     *
     * @return []
     */
    public function buildMenu()
    {
        $dir = __DIR__. "/../..";
        $finder = new Finder();
        $finder->files()->name('menu.yml')->in($dir);

        $yaml = new Parser();
        $menu = [];
        foreach ($finder as $file) {
            $fileParsed = $yaml->parse(file_get_contents($file));
            if ($fileParsed) {
                foreach($fileParsed as $item) {
                    if (!isset($item['order'])) {
                        $item['order'] = 0;
                    }
                    $menu[$item['order']] = $item;
                }
            }
        }
        ksort($menu);

        $this->rebuildWithPermissions($menu);

        return $menu;
    }

    /**
     * Solamente chequea que tenga permisos en 3 dimensiones
     * TODO: Eliminar los submenu si no tiene permisos con N dimensiones
     *
     * @param  [type] &$menu [description]
     * @return [type]        [description]
     */
    private function rebuildWithPermissions(&$menu)
    {
        foreach($menu as $iKey => $item) {
            if ($this->hasPermission($item)) {
                if (isset($item['submenu'])) {
                    foreach ($item['submenu'] as $sKey => $subitem) {
                        if ($this->hasPermission($subitem)) {
                            if (isset($subitem['submenu'])) {
                                foreach ($subitem['submenu'] as $zKey => $zubitem) {
                                    if (!$this->hasPermission($zubitem)) {
                                        unset($menu[$iKey]['submenu'][$sKey]['submenu'][$zKey]);
                                    }
                                }
                            }
                        } else {
                            unset($menu[$iKey]['submenu'][$sKey]);
                        }
                    }
                }
            } else {
                unset($menu[$iKey]);
            }
        }
    }

    private function hasPermission($menu)
    {
        if (isset($menu['permissions'])) {
            if (is_array($menu['permissions'])) {
                foreach($menu['permissions'] as $permission) {
                    if (true === $this->authorizationChecker->isGranted($permission)) {
                        return true;
                    }
                }
            } else {
                if (true === $this->authorizationChecker->isGranted($menu['permissions'])) {
                    return true;
                }
            }
            return false;
        } else {
            return true;
        }
    }
}