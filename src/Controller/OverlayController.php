<?php


namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class OverlayController extends AbstractController {
    const AUTH_KEY = 'shokztvistderbestestreamerLULW';

    protected function checkAccess(Request $request): void {
        $key = $request->query->get('API_KEY');

        if($key !== self::AUTH_KEY) {
            throw new UnauthorizedHttpException('Unknown access requested');
        }
    }
    public function feedFriday(Request $request): Response {
        $this->checkAccess($request);

        return $this->render('feed_overlay.html.twig');
    }
    public function bet(Request $request): Response {
        $this->checkAccess($request);

        return $this->render('bet_overlay.html.twig');
    }
}