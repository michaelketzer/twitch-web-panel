<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\AnalyticsRepository")
 */
class Analytics
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     */
    private $date;

    /**
     * @ORM\Column(type="integer")
     */
    private $chatters;

    /**
     * @ORM\Column(type="integer")
     */
    private $viewers;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getChatters(): ?int
    {
        return $this->chatters;
    }

    public function setChatters(int $chatters): self
    {
        $this->chatters = $chatters;

        return $this;
    }

    public function getViewers(): ?int
    {
        return $this->viewers;
    }

    public function setViewers(int $viewers): self
    {
        $this->viewers = $viewers;

        return $this;
    }
}
