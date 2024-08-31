import { toast } from 'react-toastify';

export function displayAlert (success, entity, action) {
    let entityLabel = ''
    switch(entity) {
        case 'context':
            entityLabel = 'Contexte'
            break
        case 'project':
            entityLabel = 'Projet'
            break
        case 'ticket':
            entityLabel = 'Ticket'
            break
        default:
            entityLabel = 'Entité'
    }
    if(success) {
       switch(action) {
              case 'create':
                toast.success(`${entityLabel} créé avec succès`, {
                     position: 'top-right',
                     autoClose: 5000,
                     hideProgressBar: false,
                     closeOnClick: true,
                     pauseOnHover: true,
                     draggable: true,
                     progress: undefined,
                });
                break
              case 'update':
                toast.success(`${entityLabel} mis à jour avec succès`, {
                     position: 'top-right',
                     autoClose: 5000,
                     hideProgressBar: false,
                     closeOnClick: true,
                     pauseOnHover: true,
                     draggable: true,
                     progress: undefined,
                });
                break
              case 'delete':
                toast.success(`${entityLabel} supprimé avec succès`, {
                     position: 'top-right',
                     autoClose: 5000,
                     hideProgressBar: false,
                     closeOnClick: true,
                     pauseOnHover: true,
                     draggable: true,
                     progress: undefined,
                });
                break
              default:
                toast.success(`${entityLabel} créé avec succès`, {
                     position: 'top-right',
                     autoClose: 5000,
                     hideProgressBar: false,
                     closeOnClick: true,
                     pauseOnHover: true,
                     draggable: true,
                     progress: undefined,
                });
       }
    } else {
         switch(action) {
                  case 'create':
                 toast.error(`Erreur lors de la création du ${entityLabel}`, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                 });
                 break
                  case 'update':
                 toast.error(`Erreur lors de la mise à jour du ${entityLabel}`, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                 });
                 break
                  case 'delete':
                 toast.error(`Erreur lors de la suppression du ${entityLabel}`, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                 });
                 break
                  default:
                 toast.error(`Erreur lors de la création du ${entityLabel}`, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                 });
         }
    }
}