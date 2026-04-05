import { useNavigate } from 'react-router-dom';

interface Props {
  fallback?: string;
  className?: string;
  label?: string;
}

export function GoBackButton({ fallback = '/', className, label = 'Go back' }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button className={className} onClick={handleClick}>
      {label}
    </button>
  );
}
