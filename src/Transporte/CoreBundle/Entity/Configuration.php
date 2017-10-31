<?php

namespace Transporte\CoreBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * Configuration
 *
 * @ORM\Table(name="configuration")
 * @ORM\Entity(repositoryClass="Transporte\EvntBundle\Repository\ConfigurationRepository")
 */
class Configuration
{
    const DEFAULT_CONFIGURATION = 1;

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="emailWelcome", type="text")
     * @Assert\NotBlank
     */
    private $emailWelcome;

    /**
     * @ORM\Column(name="emailSubjectWelcome", type="string", length=255)
     * @Assert\NotBlank
     */
    private $emailSubjectWelcome;

    /**
     * @ORM\OneToOne(targetEntity="Transporte\UserBundle\Entity\User", inversedBy="configuration")
     * @ORM\JoinColumn(name="created_by", referencedColumnName="id", nullable=false)
     */
    private $createdBy;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="createdAt", type="datetime")
     */
    private $createdAt;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updatedAt", type="datetime", nullable=true)
     */
    private $updatedAt;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
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

    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * Set emailWelcome
     *
     * @param string $emailWelcome
     *
     * @return Configuration
     */
    public function setEmailWelcome($emailWelcome)
    {
        $this->emailWelcome = $emailWelcome;

        return $this;
    }

    /**
     * Get emailWelcome
     *
     * @return string
     */
    public function getEmailWelcome()
    {
        return $this->emailWelcome;
    }

    /**
     * Set createdBy
     *
     * @param string $createdBy
     *
     * @return Configuration
     */
    public function setCreatedBy($createdBy)
    {
        $this->createdBy = $createdBy;

        return $this;
    }

    /**
     * Get createdBy
     *
     * @return string
     */
    public function getCreatedBy()
    {
        return $this->createdBy;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return Configuration
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
     * Set updatedAt
     *
     * @param \DateTime $updatedAt
     *
     * @return Configuration
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * Set emailSubjectWelcome
     *
     * @param string $emailSubjectWelcome
     *
     * @return Configuration
     */
    public function setEmailSubjectWelcome($emailSubjectWelcome)
    {
        $this->emailSubjectWelcome = $emailSubjectWelcome;

        return $this;
    }

    /**
     * Get emailSubjectWelcome
     *
     * @return string
     */
    public function getEmailSubjectWelcome()
    {
        return $this->emailSubjectWelcome;
    }
}
