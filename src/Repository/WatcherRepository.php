<?php

namespace App\Repository;

use App\Entity\Watcher;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Watcher|null find($id, $lockMode = null, $lockVersion = null)
 * @method Watcher|null findOneBy(array $criteria, array $orderBy = null)
 * @method Watcher[]    findAll()
 * @method Watcher[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class WatcherRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Watcher::class);
    }
}
