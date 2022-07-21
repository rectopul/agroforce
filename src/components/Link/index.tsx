import Link from 'next/link';

interface ILinkProps {
  value: string;
  href: string;
}

export function Navigate({
  value,
  href,
}: ILinkProps) {
  return (
    <ul>
      <li>
        <Link href={href}>
          <a>{value}</a>
        </Link>
      </li>
    </ul>
  );
}
