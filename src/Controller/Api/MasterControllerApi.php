<?php 

namespace App\Controller\Api;

use App\Entity\Master;
use App\Repository\MasterRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/master')]
class MasterControllerApi extends AbstractController
{
    private MasterRepository $masterRepository;
    private SerializerInterface $serializer;

    public function __construct(MasterRepository $masterRepository, SerializerInterface $serializer)
    {
        $this->serializer = $serializer;
        $this->masterRepository = $masterRepository;
    }

    #[Route('/{id}', methods: ['GET'])]
    public function getMaster(int $id): JsonResponse
    {
        $master = $this->masterRepository->find($id);
        if (!$master) {
            return new JsonResponse(['error' => 'Master not found'], 404);
        }

        return new JsonResponse($this->serializer->serialize($master, 'json', ['groups' => ['master:read']]), 200, [], true);
    }

    #[Route('/{id}/tickets', methods: ['GET'])]
    public function getMasterTickets(int $id): JsonResponse
    {
        $master = $this->masterRepository->find($id);
        if (!$master) {
            return new JsonResponse(['error' => 'Master not found'], 404);
        }

        $tickets = $master->getTickets();
        return new JsonResponse($this->serializer->serialize($tickets, 'json', ['groups' => ['ticket:read']]), 200, [], true);
    }
}