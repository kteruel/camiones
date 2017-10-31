<?php

namespace Transporte\CoreBundle\Service;

use Symfony\Component\HttpFoundation\File\UploadedFile;

use Symfony\Component\HttpFoundation\RequestStack;

class FileUploader
{
    private $targetDir;

    private $dataManager;

    private $filterManager;

    public function __construct($targetDir, $dataManager, $filterManager)
    {
        $this->targetDir = $targetDir;
        $this->dataManager = $dataManager;
        $this->filterManager = $filterManager;
    }

    /**
     * [upload description]
     * @param  UploadedFile $file            [description]
     * @param  string       $folder          Folder in web uploads
     * @param  boolean      $createThumbnail [description]
     * @return [type]                        [description]
     */
    public function upload(UploadedFile $file, $folder = '', $createThumbnail = false)
    {
        $fileName = md5(uniqid()).'.'.$file->guessExtension();

        $file->move($this->targetDir . $folder, $fileName);

        if ($createThumbnail) {
            if (!is_dir($this->targetDir . $folder . "/thumbnail")) {
                mkdir($this->targetDir . $folder . "/thumbnail");
            }
            $path = "uploads/" . $folder . "/" . $fileName;                 // domain relative path to full sized image
            $tpath = $this->targetDir . $folder . "/thumbnail/" . $fileName;     // absolute path of saved thumbnail

            $filter = 'my_filter';
            $image = $this->dataManager->find($filter, $path);                    // find the image and determine its type
            $response = $this->filterManager->applyFilter($image, $filter); // run the filter
            $thumb = $response->getContent();                               // get the image from the response

            $f = fopen($tpath, 'w');                                        // create thumbnail file
            fwrite($f, $thumb);                                             // write the thumbnail
            fclose($f);

        }

        return $fileName;
    }

    public function getTargetDir()
    {
        return $this->targetDir;
    }
}