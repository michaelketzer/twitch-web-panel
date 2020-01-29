<?php


namespace App\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class BaseTrustedServerController extends AbstractController {
    private const ALLOWED_KEY = 'biPszXqMrxYcrDRT8RgrNibWTrev34ffLZ4bNyr9';

    protected function checkAccess(Request $request): void {
        $key = $request->query->get('API_KEY');

        if($key !== self::ALLOWED_KEY) {
            throw new UnauthorizedHttpException('Unknown access requested');
        }
    }
}