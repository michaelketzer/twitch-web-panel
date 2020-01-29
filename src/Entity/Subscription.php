<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SubscriptionRepository")
 */
class Subscription
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Watcher", inversedBy="subscriptions")
     */
    private $watcher;

    /**
     * @ORM\Column(type="blob")
     */
    private $message;

    /**
     * @ORM\Column(type="integer")
     */
    private $months;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $subPlan;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $subPlanName;

    /**
     * @ORM\Column(type="datetime")
     */
    private $datetime;

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

    public function getMessage()
    {
        return $this->message;
    }

    public function setMessage($message): self
    {
        $this->message = $message;

        return $this;
    }

    public function getMonths(): ?int
    {
        return $this->months;
    }

    public function setMonths(int $months): self
    {
        $this->months = $months;

        return $this;
    }

    public function getSubPlan(): ?string
    {
        return $this->subPlan;
    }

    public function setSubPlan(string $subPlan): self
    {
        $this->subPlan = $subPlan;

        return $this;
    }

    public function getSubPlanName(): ?string
    {
        return $this->subPlanName;
    }

    public function setSubPlanName(string $subPlanName): self
    {
        $this->subPlanName = $subPlanName;

        return $this;
    }

    public function getDatetime(): ?\DateTimeInterface
    {
        return $this->datetime;
    }

    public function setDatetime(\DateTimeInterface $datetime): self
    {
        $this->datetime = $datetime;

        return $this;
    }
}
