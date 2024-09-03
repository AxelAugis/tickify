export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getProjectData(projectId) {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${apiUrl}/api/project/${projectId}/get-infos`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if(!res.ok) {
            throw new Error("An error occurred while fetching the data");
        }

        const project = await res.json();

        return project;
    } catch (error) {
        console.error('Erreur:', error);
    }
}