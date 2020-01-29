<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class BaseController extends AbstractController {
    public function welcomeAPI(): Response {
        if(!$this->getUser()) {
            throw new AuthenticationException('API requires login');
        }
        return new Response('Welcome to the API.');
    }

    public function panel(): Response {
        if(!$this->getUser() || !in_array($this->getUser()->getUserName(), ['griefcode', 'shokztv'])) {
            return $this->render('unauthorized.html.twig', ['isLogged' => !!$this->getUser()]);
        }
        return $this->render('overview.html.twig');
    }

    public function verify(): Response {
        return $this->render('verify.html.twig');
    }

    public function socialMedia(): Response {
        return $this->render('social.html.twig');
    }
}