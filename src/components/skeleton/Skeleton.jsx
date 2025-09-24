import './style.css';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse animate-shimmer rounded ${className}`} />
);

export const PostSkeleton = () => (
  <div className="p-4 border rounded-lg shadow-sm mb-4 animate-pulse bg-white">
    <div className="flex items-center mb-4">
      <Skeleton className="h-10 w-10 rounded-full mr-3 bg-gray-300" />
      <div className="flex-1">
        <Skeleton className="h-4 w-1/3 mb-2 bg-gray-300" />
        <Skeleton className="h-3 w-1/4 bg-gray-300" />
      </div>
    </div>
    <Skeleton className="h-4 w-3/4 mb-2 bg-gray-300" />
    <Skeleton className="h-4 w-2/3 mb-2 bg-gray-300" />
    <Skeleton className="h-4 w-1/2 bg-gray-300" />
  </div>
);

export const AvatarListSkeleton = ({ count = 5 }) => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-12 rounded-full" />
    ))}
  </div>
);

export const CohortSkeleton = ({ count = 3 }) => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-12 rounded-full" />
    ))}
  </div>
);
