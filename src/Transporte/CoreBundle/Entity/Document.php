<?php

namespace Transporte\CoreBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

use JMS\Serializer\Annotation as JMS;

/**
 * Document
 *
 * @ORM\Table(name="document")
 * @ORM\Entity(repositoryClass="Transporte\CoreBundle\Repository\DocumentRepository")
 * @JMS\ExclusionPolicy("all")
 */
class Document
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @JMS\Expose
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     * @Assert\NotBlank(groups={"disertant"})
     * @JMS\Expose
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="original_filename", type="string", length=255)
     * @JMS\Expose
     */
    private $originalFileName;

    /**
     * @var string
     *
     * @ORM\Column(name="file_extension", type="string", length=255)
     */
    private $fileExtension;

    /**
     * @var string
     *
     * @ORM\Column(name="file", type="string", length=255)
     * @Assert\File
     * @JMS\Accessor(getter="getWebRelativePathFile")
     * @JMS\Expose
     */
    private $file;

    /**
     * @ORM\ManyToOne(targetEntity="Transporte\UserBundle\Entity\User", inversedBy="documents")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", nullable=false)
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="Transporte\UserBundle\Entity\User")
     * @ORM\JoinColumn(name="created_by_id", referencedColumnName="id", nullable=false)
     */
    private $createdBy;

    /**
     * @ORM\Column(name="created_at", type="datetime")
     */
    private $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    /**
     * Get Web Relative Path File
     */
    public function getWebRelativePathFile()
    {
        if ($this->file) {
            return $this->getUploadDir() . $this->file;
        }

        return null;
    }

    protected function getUploadDir()
    {
        return 'uploads/documents/';
    }

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Document
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set file
     *
     * @param string $file
     *
     * @return Document
     */
    public function setFile($file)
    {
        $this->file = $file;

        return $this;
    }

    /**
     * Get file
     *
     * @return string
     */
    public function getFile()
    {
        return $this->file;
    }

    /**
     * Set user
     *
     * @param \Transporte\UserBundle\Entity\User $user
     *
     * @return Document
     */
    public function setUser(\Transporte\UserBundle\Entity\User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \Transporte\UserBundle\Entity\User
     */
    public function getUser()
    {
        return $this->user;
    }

    public function __toString()
    {
        return $this->name;
    }

    /**
     * Set createdBy
     *
     * @param \Transporte\UserBundle\Entity\User $createdBy
     *
     * @return Document
     */
    public function setCreatedBy(\Transporte\UserBundle\Entity\User $createdBy)
    {
        $this->createdBy = $createdBy;

        return $this;
    }

    /**
     * Get createdBy
     *
     * @return \Transporte\UserBundle\Entity\User
     */
    public function getCreatedBy()
    {
        return $this->createdBy;
    }

    /**
     * Set originalFileName
     *
     * @param string $originalFileName
     *
     * @return Document
     */
    public function setOriginalFileName($originalFileName)
    {
        $this->originalFileName = $originalFileName;

        return $this;
    }

    /**
     * Get originalFileName
     *
     * @return string
     */
    public function getOriginalFileName()
    {
        return $this->originalFileName;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return Document
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set fileExtension
     *
     * @param string $fileExtension
     *
     * @return Document
     */
    public function setFileExtension($fileExtension)
    {
        $this->fileExtension = $fileExtension;

        return $this;
    }

    /**
     * Get fileExtension
     *
     * @return string
     */
    public function getFileExtension()
    {
        return $this->fileExtension;
    }
}
