<?php

namespace App\Entity;

use App\Repository\ProjectRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ProjectRepository::class)]
class Project
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'SEQUENCE')]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['project:read', 'project:write'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['project:read', 'project:write'])]
    private ?string $description = null;

    #[ORM\ManyToOne(inversedBy: 'projects')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['project:read', 'project:write'])]
    private ?User $owner = null;

    #[ORM\Column]
    #[Groups(['project:read', 'project:write'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    #[Groups(['project:read', 'project:write'])]
    private ?\DateTime $updatedAt = null;

    /**
     * @var Collection<int, Ticket>
     */
    #[ORM\OneToMany(targetEntity: Ticket::class, mappedBy: 'project')]
    private Collection $tickets;

    /**
     * @var Collection<int, Context>
     */
    #[ORM\OneToMany(targetEntity: Context::class, mappedBy: 'project')]
    private Collection $contexts;

    /**
     * @var Collection<int, Master>
     */
    #[ORM\OneToMany(targetEntity: Master::class, mappedBy: 'project', orphanRemoval: true)]
    private Collection $masters;

    /**
     * @var Collection<int, Team>
     */
    #[ORM\OneToMany(targetEntity: Team::class, mappedBy: 'project', orphanRemoval: true)]
    private Collection $teams;

    #[ORM\Column(type: Types::GUID)]
    #[Groups(['project:read', 'project:write'])]
    private ?string $uuid = null;

    #[ORM\Column(length: 255, options: ['default' => '#FAFAFA'])]
    #[Groups(['project:read', 'project:write'])]
    private ?string $first_color = null;

    #[ORM\Column(length: 255, options: ['default' => '#FAFAFA'])]
    #[Groups(['project:read', 'project:write'])]
    private ?string $second_color = null;

    public function __construct()
    {
        $this->tickets = new ArrayCollection();
        $this->contexts = new ArrayCollection();
        $this->masters = new ArrayCollection();
        $this->teams = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTime
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTime $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * @return Collection<int, Ticket>
     */
    public function getTickets(): Collection
    {
        return $this->tickets;
    }

    public function addTicket(Ticket $ticket): static
    {
        if (!$this->tickets->contains($ticket)) {
            $this->tickets->add($ticket);
            $ticket->setProject($this);
        }

        return $this;
    }

    public function removeTicket(Ticket $ticket): static
    {
        if ($this->tickets->removeElement($ticket)) {
            // set the owning side to null (unless already changed)
            if ($ticket->getProject() === $this) {
                $ticket->setProject(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Context>
     */
    public function getContexts(): Collection
    {
        return $this->contexts;
    }

    public function addContext(Context $context): static
    {
        if (!$this->contexts->contains($context)) {
            $this->contexts->add($context);
            $context->setProject($this);
        }

        return $this;
    }

    public function removeContext(Context $context): static
    {
        if ($this->contexts->removeElement($context)) {
            // set the owning side to null (unless already changed)
            if ($context->getProject() === $this) {
                $context->setProject(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Master>
     */
    public function getMasters(): Collection
    {
        return $this->masters;
    }

    public function addMaster(Master $master): static
    {
        if (!$this->masters->contains($master)) {
            $this->masters->add($master);
            $master->setProject($this);
        }

        return $this;
    }

    public function removeMaster(Master $master): static
    {
        if ($this->masters->removeElement($master)) {
            // set the owning side to null (unless already changed)
            if ($master->getProject() === $this) {
                $master->setProject(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Team>
     */
    public function getTeams(): Collection
    {
        return $this->teams;
    }

    public function addTeam(Team $team): static
    {
        if (!$this->teams->contains($team)) {
            $this->teams->add($team);
            $team->setProject($this);
        }

        return $this;
    }

    public function removeTeam(Team $team): static
    {
        if ($this->teams->removeElement($team)) {
            // set the owning side to null (unless already changed)
            if ($team->getProject() === $this) {
                $team->setProject(null);
            }
        }

        return $this;
    }

    public function getUuid(): ?string
    {
        return $this->uuid;
    }

    public function setUuid(string $uuid): static
    {
        $this->uuid = $uuid;

        return $this;
    }

    public function getFirstColor(): ?string
    {
        return $this->first_color;
    }

    public function setFirstColor(string $first_color): static
    {
        $this->first_color = $first_color;

        return $this;
    }

    public function getSecondColor(): ?string
    {
        return $this->second_color;
    }

    public function setSecondColor(string $second_color): static
    {
        $this->second_color = $second_color;

        return $this;
    }
}
