import React from 'react';
import { Plus } from 'lucide-react';

const StoryViewer = ({ stories, currentUser, onAddStory }) => {
  return (
    <div className="flex gap-3 p-4 bg-dark-card border border-dark-border rounded-xl overflow-x-auto mb-4 scrollbar-custom">
      {/* Add Story Button */}
      <div
        onClick={onAddStory}
        className="flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
      >
        <div className="w-[60px] h-[60px] rounded-full bg-dark-hover border-2 border-dashed border-neutral-600 flex items-center justify-center">
          <Plus size={24} className="text-neutral-400" />
        </div>
        <span className="text-[11px] text-neutral-300 max-w-[70px] text-center truncate">
          Your Story
        </span>
      </div>

      {/* Stories List */}
      {stories && stories.map((story) => (
        <div
          key={story.story_id}
          className="flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
        >
          <div className="w-[60px] h-[60px] rounded-full bg-neutral-700 flex items-center justify-center text-neutral-50 font-semibold text-xl border-[3px] border-neutral-500 p-0.5">
            {story.username?.charAt(0).toUpperCase()}
          </div>
          <span className="text-[11px] text-neutral-300 max-w-[70px] text-center truncate">
            {story.username}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StoryViewer;
