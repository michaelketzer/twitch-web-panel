<?php

namespace App\Controller;

use App\Entity\Analytics;
use App\Entity\ChannelBots;
use App\Entity\Message;
use App\Entity\Subscription;
use App\Entity\Watcher;
use App\Repository\ChannelBotsRepository;
use App\Repository\WatcherRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class TrackerController extends BaseTrustedServerController {
    private function requireWatcher(string $name, WatcherRepository $repo, EntityManagerInterface $em): Watcher {
        $watcher = $repo->findOneBy(['displayName' => $name]);

        if(!$watcher) {
            $watcher = new Watcher();
            $watcher->setName($name);
            $watcher->setDisplayName($name);
            $watcher->setTime(0);
            $watcher->setUserId(0);

            $em->persist($watcher);
        }

        return $watcher;
    }

    public function chatters(
        Request $request,
        EntityManagerInterface $entityManager,
        WatcherRepository $repo,
        ChannelBotsRepository $channelBotsRepository
    ): JsonResponse {
        $this->checkAccess($request);
        $data = json_decode($request->getContent(), false);
        $knownBotNames = array_map(function (ChannelBots $bot) {
            return $bot->getName();
        }, $channelBotsRepository->findAll());

        $joined = array_filter($data->chatter->joined, function(string $name) use ($knownBotNames) {
           return !in_array($name, $knownBotNames);
        });
        $stayed = array_filter($data->chatter->stayed, function(string $name) use ($knownBotNames) {
           return !in_array($name, $knownBotNames);
        });

        $analystics = new Analytics();
        $analystics->setDate(new \DateTime());
        $analystics->setChatters(count($joined) + count($stayed));
        $analystics->setViewers($data->stream->viewers);
        $entityManager->persist($analystics);

        foreach($joined as $watcher) {
          $this->requireWatcher($watcher, $repo, $entityManager);
        }

        foreach($stayed as $watcher) {
          $watcher = $this->requireWatcher($watcher, $repo, $entityManager);
          $watcher->setTime($watcher->getTime() + 90);
        }

        $entityManager->flush();
        return new JsonResponse(null, JsonResponse::HTTP_CREATED);
    }

    public function message(Request $request, EntityManagerInterface $entityManager, WatcherRepository $repo): JsonResponse {
        $this->checkAccess($request);
        $data = json_decode($request->getContent());

        $watcher = $this->requireWatcher($data->username, $repo, $entityManager);

        $entity = new Message();
        $entity->setWatcher($watcher);
        $entity->setDatetime(new \DateTime());
        $entity->setMessage($data->message);
        $entityManager->persist($entity);
        $entityManager->flush();

        return new JsonResponse(null, JsonResponse::HTTP_CREATED);
    }

    public function subscription(Request $request, EntityManagerInterface $entityManager, WatcherRepository $repo): JsonResponse {
        $this->checkAccess($request);
        $data = json_decode($request->getContent());

        $watcher = $this->requireWatcher($data->username, $repo, $entityManager);

        $entity = new Subscription();
        $entity->setWatcher($watcher);
        $entity->setDatetime(new \DateTime());
        $entity->setMessage($data->message ?? '');
        $entity->setMonths($data->months);
        $entity->setSubPlan($data->subPlan);
        $entity->setSubPlanName($data->subPlanName);
        $entityManager->persist($entity);
        $entityManager->flush();

        return new JsonResponse(null, JsonResponse::HTTP_CREATED);
    }
}