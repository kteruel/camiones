<?php

namespace Transporte\UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use FOS\UserBundle\Model\User as BaseUser;

use Symfony\Component\Validator\Constraints as Assert;

use JMS\Serializer\Annotation as JMS;

use Doctrine\ORM\Mapping\AttributeOverrides;
use Doctrine\ORM\Mapping\AttributeOverride;

use Transporte\CoreBundle\Entity\Constant;

/**
 * @ORM\Entity(repositoryClass="Transporte\UserBundle\Repository\UserRepository")
 * @ORM\Table(name="fos_user")
 * @UniqueEntity("username", message="El username ya fue utilizado")
 * @UniqueEntity("email", message="El email ya fue utilizado", groups={"profile", "Default"})
 */
class User extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     * @JMS\Exclude
     */
    protected $id;

    /**
     * @ORM\ManyToMany(targetEntity="Transporte\UserBundle\Entity\Group")
     * @ORM\JoinTable(name="fos_user_user_group",
     *      joinColumns={@ORM\JoinColumn(name="user_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="group_id", referencedColumnName="id")}
     * )
     */
    protected $groups;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255, nullable=true)
     * @Assert\NotBlank(groups={"profile", "Default"})
     * @JMS\Expose
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="lastName", type="string", length=255, nullable=true)
     * @Assert\NotBlank(groups={"profile", "Default"})
     * @JMS\Expose
     */
    private $lastName;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="createdDate", type="datetime")
     * @JMS\Exclude
     */
    private $createdDate;

    /**
     * @ORM\ManyToOne(targetEntity="Transporte\UserBundle\Entity\User")
     */
    private $createdBy;

    /**
     * @ORM\ManyToOne(targetEntity="Transporte\UserBundle\Entity\User")
     */
    private $updatedBy;

    /**
     * @var string
     *
     * @ORM\Column(name="position", type="string", length=255, nullable=true)
     * @JMS\Expose
     */
    private $position;

    /**
     * @var string
     *
     * @ORM\OneToMany(targetEntity="Transporte\CoreBundle\Entity\Document", mappedBy="user")
     */
    private $documents;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", nullable=true)
     * @JMS\Expose
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(name="gender", type="string", length=25, nullable=true)
     * @JMS\Expose
     */
    private $gender;

    /**
     * @var string
     *
     * @ORM\Column(name="phone", type="string", length=125, nullable=true)
     * @JMS\Expose
     */
    private $phone;

    /**
     * @var string
     *
     * @ORM\Column(name="photo", type="string", length=255, nullable=true)
     * @JMS\Expose
     * @JMS\Accessor(getter="getWebRelativePathPhoto")
     */
    private $photo;

    /**
     * @var datetime
     *
     * @ORM\Column(name="birth_date", type="string", length=32, nullable=true)
     * @JMS\Expose
     */
    private $birthDate;

    /**
     * @var string
     *
     * @ORM\Column(name="country", type="string", length=255, nullable=true)
     * @JMS\Expose
     */
    private $country;

    /**
     * @var string
     *
     * @ORM\Column(name="province", type="string", length=255, nullable=true)
     * @JMS\Expose
     */
    private $province;

    /**
     * @var string
     * Barrio
     *
     * @ORM\Column(name="district", type="string", length=255, nullable=true)
     * @JMS\Expose
     */
    private $district;

    /**
     * @var string
     *
     * @ORM\Column(name="ambit", type="string", length=255, nullable=true)
     * @JMS\Expose
     */
    private $ambit;

    /**
     * @var string
     *
     * @ORM\Column(name="organization", type="string", length=255, nullable=true)
     * @JMS\Expose
     */
    private $organization;

    /**
     * @var string
     *
     * @ORM\Column(name="role", type="string", length=255, nullable=true)
     * @JMS\Expose
     */
    private $role;

    /**
     * @var string
     *
     * @ORM\Column(name="area", type="string", length=255, nullable=true)
     * @JMS\Expose
     */
    private $area;

    /**
     * @var string
     *
     * @ORM\Column(name="facebook", type="string", length=255, nullable=true)
     * @JMS\Expose
     */
    private $facebook;

    /**
     * @var string
     *
     * @ORM\Column(name="twitter", type="string", length=255, nullable=true)
     * @JMS\Expose
     */
    private $twitter;

    /**
     * @var string
     *
     * @ORM\Column(name="linkedin", type="string", length=255, nullable=true)
     * @JMS\Expose
     */
    private $linkedin;

    /**
     * @var string
     *
     * @ORM\Column(name="instagram", type="string", length=255, nullable=true)
     * @JMS\Expose
     */
    private $instagram;

    /**
     * @var string
     *
     * @ORM\Column(name="autorization", type="string", length=15, nullable=true)
     * @JMS\Expose
     */
    private $autorization;

    /**
     * @var boolean
     *
     * @ORM\Column(name="register_mobile", type="boolean", options={"default" : false})
     * @Assert\NotNull()
     */
    private $registerMobile;

    /**
     * @var boolean
     *
     * @ORM\Column(name="register_facebook", type="boolean" , options={"default" : false})
     */
    private $registerFacebook;

    /**
     * @ORM\OneToOne(targetEntity="Transporte\CoreBundle\Entity\Configuration", mappedBy="createdBy", cascade={"remove"})
     */
    private $configuration;

    public function __construct($name = null, $lastName = null, $username = null, $email = null, $position = null, $registerMobile = false)
    {
        parent::__construct();
        $this->enabled = true;
        $this->createdDate = new \DateTime();
        $this->name = $name;
        $this->lastName = $lastName;
        $this->username = $username;
        $this->email = $email;
        $this->position = $position;
        $this->registerMobile = $registerMobile;
        $this->registerFacebook = false;
    }

    /**
     * @JMS\VirtualProperty
     * @JMS\SerializedName("user")
     *
     * @return string
     */
    public function __toString()
    {
        if ($this->getName()) {
            return $this->getName() . " " . $this->getLastName();
        } else {
            return $this->username;
        }
    }

    private function getAbsoluteRootDir()
    {
        return $this->getWebDirectory() . "/" . $this->getUploadDir();
    }

    protected function getUploadDir()
    {
        return 'uploads/users';
    }

    public function getWebDirectory()
    {
        return __DIR__ . "/../../../../web";
    }

    /**
     * Get Absolute Path Photo
     */
    public function getAbsoluteRootDirPhoto()
    {
        return $this->getAbsoluteRootDir() . $this->photo;
    }

    /**
     * Get Web Relative Path Photo
     */
    public function getWebRelativePathPhoto()
    {
        if ($this->photo) {
            return $this->getUploadDir() . "/" . $this->photo;
        }

        return null;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return User
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
     * Set lastName
     *
     * @param string $lastName
     *
     * @return User
     */
    public function setLastName($lastName)
    {
        $this->lastName = $lastName;

        return $this;
    }

    /**
     * Get lastName
     *
     * @return string
     */
    public function getLastName()
    {
        return $this->lastName;
    }

    /**
     * Set createdDate
     *
     * @param \DateTime $createdDate
     *
     * @return User
     */
    public function setCreatedDate($createdDate)
    {
        $this->createdDate = $createdDate;

        return $this;
    }

    /**
     * Get createdDate
     *
     * @return \DateTime
     */
    public function getCreatedDate()
    {
        return $this->createdDate;
    }

    /**
     * Set position
     *
     * @param string $position
     *
     * @return User
     */
    public function setPosition($position)
    {
        $this->position = $position;

        return $this;
    }

    /**
     * Get position
     *
     * @return string
     */
    public function getPosition()
    {
        return $this->position;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return User
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set gender
     *
     * @param string $gender
     *
     * @return User
     */
    public function setGender($gender)
    {
        $this->gender = $gender;

        return $this;
    }

    /**
     * Get gender
     *
     * @return string
     */
    public function getGender()
    {
        return $this->gender;
    }

    /**
     * Set phone
     *
     * @param string $phone
     *
     * @return User
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;

        return $this;
    }

    /**
     * Get phone
     *
     * @return string
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * Set photo
     *
     * @param string $photo
     *
     * @return User
     */
    public function setPhoto($photo)
    {
        $this->photo = $photo;

        return $this;
    }

    /**
     * Get photo
     *
     * @return string
     */
    public function getPhoto()
    {
        return $this->photo;
    }

    /**
     * Set birthDate
     *
     * @param string $birthDate
     *
     * @return User
     */
    public function setBirthDate($birthDate)
    {
        $this->birthDate = $birthDate;

        return $this;
    }

    /**
     * Get birthDate
     *
     * @return string
     */
    public function getBirthDate()
    {
        return $this->birthDate;
    }

    /**
     * Set country
     *
     * @param string $country
     *
     * @return User
     */
    public function setCountry($country)
    {
        $this->country = $country;

        return $this;
    }

    /**
     * Get country
     *
     * @return string
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * Set province
     *
     * @param string $province
     *
     * @return User
     */
    public function setProvince($province)
    {
        $this->province = $province;

        return $this;
    }

    /**
     * Get province
     *
     * @return string
     */
    public function getProvince()
    {
        return $this->province;
    }

    /**
     * Set district
     *
     * @param string $district
     *
     * @return User
     */
    public function setDistrict($district)
    {
        $this->district = $district;

        return $this;
    }

    /**
     * Get district
     *
     * @return string
     */
    public function getDistrict()
    {
        return $this->district;
    }

    /**
     * Set ambit
     *
     * @param string $ambit
     *
     * @return User
     */
    public function setAmbit($ambit)
    {
        $this->ambit = $ambit;

        return $this;
    }

    /**
     * Get ambit
     *
     * @return string
     */
    public function getAmbit()
    {
        return $this->ambit;
    }

    /**
     * Set organization
     *
     * @param string $organization
     *
     * @return User
     */
    public function setOrganization($organization)
    {
        $this->organization = $organization;

        return $this;
    }

    /**
     * Get organization
     *
     * @return string
     */
    public function getOrganization()
    {
        return $this->organization;
    }

    /**
     * Set role
     *
     * @param string $role
     *
     * @return User
     */
    public function setRole($role)
    {
        $this->role = $role;

        return $this;
    }

    /**
     * Get role
     *
     * @return string
     */
    public function getRole()
    {
        return $this->role;
    }

    /**
     * Set area
     *
     * @param string $area
     *
     * @return User
     */
    public function setArea($area)
    {
        $this->area = $area;

        return $this;
    }

    /**
     * Get area
     *
     * @return string
     */
    public function getArea()
    {
        return $this->area;
    }

    /**
     * Set facebook
     *
     * @param string $facebook
     *
     * @return User
     */
    public function setFacebook($facebook)
    {
        $this->facebook = $facebook;

        return $this;
    }

    /**
     * Get facebook
     *
     * @return string
     */
    public function getFacebook()
    {
        return $this->facebook;
    }

    /**
     * Set twitter
     *
     * @param string $twitter
     *
     * @return User
     */
    public function setTwitter($twitter)
    {
        $this->twitter = $twitter;

        return $this;
    }

    /**
     * Get twitter
     *
     * @return string
     */
    public function getTwitter()
    {
        return $this->twitter;
    }

    /**
     * Set linkedin
     *
     * @param string $linkedin
     *
     * @return User
     */
    public function setLinkedin($linkedin)
    {
        $this->linkedin = $linkedin;

        return $this;
    }

    /**
     * Get linkedin
     *
     * @return string
     */
    public function getLinkedin()
    {
        return $this->linkedin;
    }

    /**
     * Set instagram
     *
     * @param string $instagram
     *
     * @return User
     */
    public function setInstagram($instagram)
    {
        $this->instagram = $instagram;

        return $this;
    }

    /**
     * Get instagram
     *
     * @return string
     */
    public function getInstagram()
    {
        return $this->instagram;
    }

    /**
     * Set autorization
     *
     * @param string $autorization
     *
     * @return User
     */
    public function setAutorization($autorization)
    {
        $this->autorization = $autorization;

        return $this;
    }

    /**
     * Get autorization
     *
     * @return string
     */
    public function getAutorization()
    {
        return $this->autorization;
    }

    /**
     * Set registerMobile
     *
     * @param boolean $registerMobile
     *
     * @return User
     */
    public function setRegisterMobile($registerMobile)
    {
        $this->registerMobile = $registerMobile;

        return $this;
    }

    /**
     * Get registerMobile
     *
     * @return boolean
     */
    public function getRegisterMobile()
    {
        return $this->registerMobile;
    }

    /**
     * Set registerFacebook
     *
     * @param boolean $registerFacebook
     *
     * @return User
     */
    public function setRegisterFacebook($registerFacebook)
    {
        $this->registerFacebook = $registerFacebook;

        return $this;
    }

    /**
     * Get registerFacebook
     *
     * @return boolean
     */
    public function getRegisterFacebook()
    {
        return $this->registerFacebook;
    }

    /**
     * Set createdBy
     *
     * @param \Transporte\UserBundle\Entity\User $createdBy
     *
     * @return User
     */
    public function setCreatedBy(\Transporte\UserBundle\Entity\User $createdBy = null)
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
     * Set updatedBy
     *
     * @param \Transporte\UserBundle\Entity\User $updatedBy
     *
     * @return User
     */
    public function setUpdatedBy(\Transporte\UserBundle\Entity\User $updatedBy = null)
    {
        $this->updatedBy = $updatedBy;

        return $this;
    }

    /**
     * Get updatedBy
     *
     * @return \Transporte\UserBundle\Entity\User
     */
    public function getUpdatedBy()
    {
        return $this->updatedBy;
    }

    /**
     * Set configuration
     *
     * @param \Transporte\CoreBundle\Entity\Configuration $configuration
     *
     * @return User
     */
    public function setConfiguration(\Transporte\CoreBundle\Entity\Configuration $configuration = null)
    {
        $this->configuration = $configuration;

        return $this;
    }

    /**
     * Get configuration
     *
     * @return \Transporte\CoreBundle\Entity\Configuration
     */
    public function getConfiguration()
    {
        return $this->configuration;
    }

    /**
     * Add document
     *
     * @param \Transporte\CoreBundle\Entity\Document $document
     *
     * @return User
     */
    public function addDocument(\Transporte\CoreBundle\Entity\Document $document)
    {
        $this->documents[] = $document;

        return $this;
    }

    /**
     * Remove document
     *
     * @param \Transporte\CoreBundle\Entity\Document $document
     */
    public function removeDocument(\Transporte\CoreBundle\Entity\Document $document)
    {
        $this->documents->removeElement($document);
    }

    /**
     * Get documents
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getDocuments()
    {
        return $this->documents;
    }
}
