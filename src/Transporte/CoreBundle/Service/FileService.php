<?php
namespace Transporte\CoreBundle\Service;

use Symfony\Component\Filesystem\Exception\FileNotFoundException;
use Symfony\Component\Filesystem\Exception\AccessDeniedException;

/**
 * Service for managing files
 */
class FileService
{
    /**
     * Open File and return handle
     *
     * @param string $filePath
     * @return resource
     */
    public function openFile($filePath)
    {
        if (!file_exists($filePath)) {
            throw new FileNotFoundException("File not found $filePath");
        }
        if (($handle = fopen($filePath, "r")) == FALSE) {
            throw new AccessDeniedException("Error opening file $filePath");
        }
        return $handle;
    }

    public function countRows($filePath)
    {
        $fp = file($filePath);
        return count($fp);
    }

}