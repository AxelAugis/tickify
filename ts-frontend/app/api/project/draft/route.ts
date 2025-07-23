
import { NextRequest } from 'next/server';
import redis from '@/app/lib/redis';
import { ProjectDraftProps } from '@/types/projectDraft';

export async function GET() {
  try {
    const draft = await redis.get('new_project_draft');
    return new Response(
      JSON.stringify({ draft: draft ? JSON.parse(draft) : null }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération du brouillon:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data }: { data: ProjectDraftProps } = body;
    await redis.set(
      'new_project_draft',
      JSON.stringify(data),
      'EX',
      86400 // Expire après 24 heures
    );
    return new Response(
      JSON.stringify({ message: 'Brouillon sauvegardé' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du brouillon:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE() {
  try {
    await redis.del('new_project_draft');
    return new Response(
      JSON.stringify({ message: 'Brouillon supprimé' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression du brouillon:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}