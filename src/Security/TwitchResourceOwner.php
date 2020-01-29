<?php

namespace App\Security;


use League\OAuth2\Client\Provider\ResourceOwnerInterface;
use League\OAuth2\Client\Tool\ArrayAccessorTrait;

class TwitchResourceOwner implements ResourceOwnerInterface {
    use ArrayAccessorTrait;

    /**
     * Raw response
     *
     * @var array
     */
    protected $response;

    /**
     * Creates new resource owner.
     *
     * @param array  $response
     */
    public function __construct(array $response = array()) {
        $this->response = $response;
    }

    /**
     * Returns the identifier of the authorized resource owner.
     *
     * @return mixed
     */
    public function getId() {
        return $this->getValueByKey($this->response, '_id');
    }

    /**
     * @return string
     */
    public function getUsername() {
        return $this->getValueByKey($this->response, 'name');
    }

    /**
     * @return string
     */
    public function getEmail() {
        return $this->getValueByKey($this->response, 'email');
    }

    /**
     * @return bool
     */
    public function getEmailVerified() {
        return $this->getValueByKey($this->response, 'email_verified');
    }

    /**
     * @return bool
     */
    public function getLogo() {
        return $this->getValueByKey($this->response, 'logo');
    }

    /**
     * Return all of the owner details available as an array.
     *
     * @return array
     */
    public function toArray() {
        return $this->response;
    }
}