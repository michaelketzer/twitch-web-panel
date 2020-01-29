<?php


namespace App\Controller;

use App\Entity\Bet;
use App\Entity\BetRound;
use App\Entity\Watcher;
use App\Repository\BetRepository;
use App\Repository\BetRoundRepository;
use App\Repository\WatcherRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Gamebetr\Provable\Provable;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class BetController extends BaseTrustedServerController
{
    public function createRound(Request $request, BetRoundRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $this->checkAccess($request);
        $maxRound = $repo->findOneBy([], ['season' => 'DESC', 'round' => 'DESC']);

        $season = $maxRound ? $maxRound->getSeason() : 1;
        $round = $maxRound ? $maxRound->getRound() + 1 : 1;

        $betRound = new BetRound();
        $betRound->setSeason($season);
        $betRound->setRound($round);
        $betRound->setStarted(new \DateTime());
        $betRound->setStatus('started');
        $betRound->setResult('');

        $em->persist($betRound);
        $em->flush();

        return new JsonResponse($maxRound->getId(), JsonResponse::HTTP_CREATED);
    }

    public function updateStatus(Request $request, BetRoundRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $this->checkAccess($request);
        $content = json_decode($request->getContent());
        $currentRound = $repo->findOneBy([], ['season' => 'DESC', 'round' => 'DESC']);

        if ($content->status === 'running') {
            $currentRound->setStatus('running');
        } elseif ($content->status === 'finished') {
            $currentRound->setStatus('finished');
            $currentRound->setResult($content->winner);
        }

        $em->flush();

        return new JsonResponse(null, JsonResponse::HTTP_OK);
    }

    public function registerBet(Request $request, WatcherRepository $watcherRepo, BetRoundRepository $repo, EntityManagerInterface $em, BetRepository $betRepo): JsonResponse
    {
        $this->checkAccess($request);
        $content = json_decode($request->getContent());
        $watcher = $watcherRepo->findOneBy(['displayName' => $content->username]);
        if(! $watcher) {
            $watcher = new Watcher();
            $watcher->setDisplayName($content->username);
            $watcher->setName($content->username);
            $watcher->setTime(0);
            $watcher->setUserId(0);
            $em->persist($watcher);
        }
        $currentRound = $repo->findOneBy(['status' => 'started'], ['season' => 'DESC', 'round' => 'DESC']);

        $bet = $betRepo->findOneBy(['watcher' => $watcher, 'round' => $currentRound]);
        if (!$bet) {
            $bet = new Bet();
            $bet->setWatcher($watcher);
            $bet->setRound($currentRound);
            $bet->setDate(new \DateTime());
            $bet->setVote($content->vote);

            $em->persist($bet);
            $em->flush();
        }
        return new JsonResponse(null, JsonResponse::HTTP_CREATED);
    }

    public function getTopList(BetRoundRepository $repo): JsonResponse
    {
        $currentRound = $repo->findOneBy([], ['season' => 'DESC']);
        if (!$currentRound) {
            return new JsonResponse([]);
        }

        return new JsonResponse($repo->getToplist($currentRound->getSeason()));
    }

    public function getRecentBets(BetRoundRepository $repo): JsonResponse
    {
        $currentRound = $repo->findOneBy([], ['season' => 'DESC']);
        if (!$currentRound) {
            return new JsonResponse([]);
        }

        return new JsonResponse($repo->getRecentBets($currentRound->getSeason()));
    }

    private const SERVER_SEED = '0dd0925b43b9e36dbbc78a4ec9e4ae5d';

    public function randomWinner(BetRoundRepository $repo): JsonResponse
    {
        $currentRound = $repo->findOneBy([], ['season' => 'DESC']);
        if (!$currentRound) {
            return new JsonResponse([]);
        }

        $entries = $this->getAllParticipants($currentRound->getSeason(), $repo);
        $clientSeed = md5(uniqid(rand(), true));
        $provable = new Provable($clientSeed, self::SERVER_SEED, 0, count($entries));
        $result = $provable->results();

        return new JsonResponse([
            'clientSeed' => $clientSeed,
            'result' => $result,
            'winner' => $entries[$result - 1]
        ]);
    }

    public function participants(BetRoundRepository $repo): JsonResponse
    {
        $currentRound = $repo->findOneBy([], ['season' => 'DESC']);
        if (!$currentRound) {
            return new JsonResponse([]);
        }
        $entries = $this->getAllParticipants($currentRound->getSeason(), $repo);

        return new JsonResponse(['entries' => $entries]);
    }

    public function verifyWinner(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent());
        $provable = new Provable($data->clientSeed, self::SERVER_SEED, 0, $data->count);

        return new JsonResponse(['result' => $provable->results()]);
    }

    private function getAllParticipants(int $season, BetRoundRepository $repo)
    {

        $participants = $repo->getParticipants($season);
        $entries = [];

        foreach ($participants as $p) {
            $entries = array_merge($entries, array_fill(0, $p['entries'], $p['name']));
        }

        return $entries;
    }

    public function seasonInfo(BetRoundRepository $repo): JsonResponse
    {
        $currentRound = $repo->findOneBy([], ['season' => 'DESC', 'round' => 'DESC']);
        $season = $currentRound ? $currentRound->getSeason() : 1;
        $round = $currentRound ? $currentRound->getRound() : 1;

        return new JsonResponse(['season' => $season, 'round' => $round]);
    }

    public function newSeason(BetRoundRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $currentRound = $repo->findOneBy([], ['season' => 'DESC', 'round' => 'DESC']);
        if ($currentRound) {
            $newSeason = $currentRound->getSeason() + 1;

            $entity = new BetRound();
            $entity->setSeason($newSeason);
            $entity->setRound(1);
            $entity->setResult('');
            $entity->setStarted(new \DateTime());
            $entity->setStatus('finished');

            $em->persist($entity);
            $em->flush();
        }

        return new JsonResponse(null, JsonResponse::HTTP_CREATED);
    }

    public function changeRoundWinner(int $betRoundId, BetRoundRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $rEntity = $repo->find($betRoundId);
        if ($rEntity) {
            $rEntity->setResult($rEntity->getResult() === 'a' ? 'b' : 'a');
            $em->flush();
        }

        return new JsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
    }

    public function userstats(string $username, BetRoundRepository $repo): JsonResponse {
        $currentRound = $repo->findOneBy([], ['season' => 'DESC', 'round' => 'DESC']);
        if($currentRound) {
            $stats = $repo->getParticipantStats($currentRound->getSeason(), $username);
            return new JsonResponse($stats[0], JsonResponse::HTTP_OK);
        }
        return new JsonResponse(null, JsonResponse::HTTP_SERVICE_UNAVAILABLE);
    }
}