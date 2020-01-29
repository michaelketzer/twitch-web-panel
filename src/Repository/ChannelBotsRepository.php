<?php

namespace App\Repository;

use App\Entity\ChannelBots;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method ChannelBots|null find($id, $lockMode = null, $lockVersion = null)
 * @method ChannelBots|null findOneBy(array $criteria, array $orderBy = null)
 * @method ChannelBots[]    findAll()
 * @method ChannelBots[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ChannelBotsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ChannelBots::class);
    }
}
