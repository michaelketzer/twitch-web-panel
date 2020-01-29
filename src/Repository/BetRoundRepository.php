<?php

namespace App\Repository;

use App\Entity\BetRound;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Types\Type;
use Doctrine\ORM\EntityManager;

/**
 * @method BetRound|null find($id, $lockMode = null, $lockVersion = null)
 * @method BetRound|null findOneBy(array $criteria, array $orderBy = null)
 * @method BetRound[]    findAll()
 * @method BetRound[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BetRoundRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BetRound::class);
    }

    public function getToplist(int $season, int $limit = 10): array
    {
        $sql = "SELECT 
                    w.display_name as name,
                    SUM(IF(b.vote = br.result, 1, 0)) as won,
                    COUNT(b.id) as total
                  FROM bet b
            INNER JOIN bet_round br ON br.id = b.round_id AND br.season = :season AND br.status = 'finished'
            INNER JOIN watcher w on b.watcher_id = w.id
              GROUP BY b.watcher_id
              ORDER BY won DESC, total
                 LIMIT $limit";

        $list = $this->getEntityManager()->getConnection()->fetchAll($sql, ['season' => $season]);

        $mapped = [];
        $i = 1;
        foreach($list as $entry) {
            $mapped[] = [
                'rank' => $i,
                'name' => $entry['name'],
                'won' => (int) $entry['won'],
                'total' => (int) $entry['total'],
                'winPercentage' => floor(((int) $entry['won'] * 100) / (int) $entry['total']),
            ];
            ++$i;
        }

        return $mapped;
    }

    public function getRecentBets(int $season, int $limit = 5): array
    {
        $sql = "SELECT 
                    br.id,
                    br.started as date,
                    br.result as winner,
                    SUM(IF(b.vote = 'a', 1, 0)) as aBets,
                    SUM(IF(b.vote = 'b', 1, 0)) as bBets
                  FROM bet_round br
             LEFT JOIN bet b ON br.id = b.round_id AND br.season = :season
                 WHERE br.status = 'finished'
              GROUP BY br.id
              ORDER BY br.started DESC
                 LIMIT $limit";

        return $this->getEntityManager()->getConnection()->fetchAll($sql, ['season' => $season]);
    }

    public function getParticipants(int $season): array
    {
        $sql = "SELECT 
                    w.display_name as name,
                    SUM(IF(b.vote = br.result, 1, 0)) as entries
                  FROM bet b
            INNER JOIN bet_round br ON br.id = b.round_id AND br.season = :season AND br.status = 'finished'
            INNER JOIN watcher w on b.watcher_id = w.id
              GROUP BY b.watcher_id
              ORDER BY w.id";

        return $this->getEntityManager()->getConnection()->fetchAll($sql, ['season' => $season]);
    }

    public function getParticipantStats(int $season, string $name): array
    {
        $sql = "SELECT 
                    SUM(IF(b.vote = br.result, 1, 0)) as wins, COUNT(b.id) as rounds
                  FROM bet b
            INNER JOIN bet_round br ON br.id = b.round_id AND br.season = :season AND br.status = 'finished'
            INNER JOIN watcher w on b.watcher_id = w.id
                 WHERE w.display_name = :name
              GROUP BY b.watcher_id";

        return $this->getEntityManager()->getConnection()->fetchAll($sql, ['season' => $season, 'name' => $name]);
    }
}
