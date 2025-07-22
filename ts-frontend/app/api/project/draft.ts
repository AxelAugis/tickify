// pages/api/project/draft.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '@/app/lib/redis';
import { ProjectDraftProps } from '@/types/projectDraft';

interface DraftResponse {
  draft: ProjectDraftProps | null;
}

interface SaveDraftRequest {
  data: ProjectDraftProps;
}

interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DraftResponse | ErrorResponse | { message: string }>
) {
  const { userId, projectId } = req.query as { userId: string; projectId: string };

  if (req.method === 'GET') {
    try {
      const draft = await redis.get(`user:${userId}:project:${projectId}:draft`);
      return res.status(200).json({ draft: draft ? JSON.parse(draft) : null });
    } catch (error) {
      console.error('Erreur lors de la récupération du brouillon:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { data }: SaveDraftRequest = req.body;
      await redis.set(
        `user:${userId}:project:${projectId}:draft`,
        JSON.stringify(data),
        'EX',
        86400 // Expire après 24 heures
      );
      return res.status(200).json({ message: 'Brouillon sauvegardé' });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du brouillon:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}