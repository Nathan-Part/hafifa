import { useParams } from 'react-router-dom';

function DetailsUtilisateur(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <h1>Détails de l'utilisateur</h1>
      <p>ID de l'utilisateur : {id}</p>
    </div>
  );
}

export default DetailsUtilisateur;
