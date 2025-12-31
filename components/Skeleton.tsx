
import React from 'react';

const Skeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-12">
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <div className="h-4 bg-gray-100 rounded-full w-24 mx-auto"></div>
        <div className="h-12 bg-gray-100 rounded w-3/4 mx-auto"></div>
        <div className="h-6 bg-gray-100 rounded w-1/2 mx-auto"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="aspect-video bg-gray-100"></div>
            <div className="p-5 space-y-4">
              <div className="h-3 bg-gray-100 rounded w-16"></div>
              <div className="h-6 bg-gray-100 rounded w-full"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full"></div>
                <div className="h-3 bg-gray-100 rounded w-5/6"></div>
              </div>
              <div className="h-4 bg-gray-100 rounded w-24 pt-4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
