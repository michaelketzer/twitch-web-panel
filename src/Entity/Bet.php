<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\BetRepository")
 */
class Bet
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Watcher", inversedBy="bets")
     * @ORM\JoinColumn(nullable=false)
     */
    private $watcher;

    /**
     * @ORM\Column(type="datetime")
     */
    private $date;

    /**
     * @ORM\Column(type="string", length=4)
     */
    private $vote;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\BetRound", inversedBy="bets")
     * @ORM\JoinColumn(nullable=false)
     */
    private $round;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getWatcher(): ?Watcher
    {
        return $this->watcher;
    }

    public function setWatcher(?Watcher $watcher): self
    {
        $this->watcher = $watcher;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getVote(): ?string
    {
        return $this->vote;
    }

    public function setVote(string $vote): self
    {
        $this->vote = $vote;

        return $this;
    }

    public function getRound(): ?BetRound
    {
        return $this->round;
    }

    public function setRound(?BetRound $round): self
    {
        $this->round = $round;

        return $this;
    }
}
