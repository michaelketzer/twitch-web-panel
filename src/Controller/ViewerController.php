<?php


namespace App\Controller;


use App\Entity\Analytics;
use App\Repository\AnalyticsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class ViewerController extends AbstractController {
    public function getViewersHistory(AnalyticsRepository $repo): JsonResponse {
        $viewerHistory = $repo->findBy([], ['date' => 'DESC'], 10);

        $history = array_map(function(Analytics $analytics) {
            return [$analytics->getViewers(), $analytics->getChatters(), $analytics->getDate()->getTimestamp()];
        }, $viewerHistory);

        return new JsonResponse(array_reverse($history), JsonResponse::HTTP_OK);
    }

}