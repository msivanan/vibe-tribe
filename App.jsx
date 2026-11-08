import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  PlusSquare, 
  Home, 
  User, 
  Users, 
  Volume2, 
  VolumeX, 
  Play, 
  X, 
  Send,
  Sparkles,
  Music
} from 'lucide-react';

const INITIAL_VIDEOS = [
  {
    id: 'v1',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-skater-performing-a-trick-in-a-skatepark-42864-large.mp4',
    author: 'alex_skates',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    caption: 'Nailed the heel flip after 50 tries! 🛹🔥 #skate #friends',
    likes: 124,
    commentsCount: 18,
    isLiked: false,
    isBookmarked: false,
    circle: 'Skate Squad',
    songTitle: 'Original Audio - alex_skates',
    comments: [
      { id: 'c1', user: 'sarah_m', text: 'Clean landing! 🔥', time: '2h ago' },
      { id: 'c2', user: 'jordan_k', text: 'Bro finally!! Let us go!', time: '1h ago' }
    ]
  },
  {
    id: 'v2',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-young-friends-laughing-and-having-fun-at-night-42845-large.mp4',
    author: 'sarah_m',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    caption: 'Late night rooftop hangs with the best team ✨ night vibe',
    likes: 256,
    commentsCount: 42,
    isLiked: true,
    isBookmarked: true,
    circle: 'Close Friends',
    songTitle: 'Lofi Chill Beats Vol 4',
    comments: [
      { id: 'c3', user: 'alex_skates', text: 'Best weekend ever', time: '4h ago' }
    ]
  },
  {
    id: 'v3',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-having-a-party-and-toast-42851-large.mp4',
    author: 'jordan_k',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    caption: 'Birthday bash recap! Thanks everyone for coming through 🎉',
    likes: 89,
    commentsCount: 7,
    isLiked: false,
    isBookmarked: false,
    circle: 'Party Squad',
    songTitle: 'Party Anthem Remix',
    comments: []
  }
];

const INITIAL_STORIES = [
  { id: 's1', user: 'Your Story', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', hasStory: false },
  { id: 's2', user: 'alex_skates', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', hasStory: true },
  { id: 's3', user: 'sarah_m', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', hasStory: true },
  { id: 's4', user: 'jordan_k', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80', hasStory: true },
  { id: 's5', user: 'emma_w', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', hasStory: true }
];

export default function App() {
  const [videos, setVideos] = useState(INITIAL_VIDEOS);
  const [activeTab, setActiveTab] = useState('feed');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [activeCommentVideo, setActiveCommentVideo] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [feedFilter, setFeedFilter] = useState('all');

  // Video creation state
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [selectedCircle, setSelectedCircle] = useState('Close Friends');

  const containerRef = useRef(null);

  // Handle snapping / scroll to update active index
  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollPosition = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    const index = Math.round(scrollPosition / height);
    if (index !== currentVideoIndex && index >= 0 && index < filteredVideos.length) {
      setCurrentVideoIndex(index);
    }
  };

  const filteredVideos = videos.filter(v => {
    if (feedFilter === 'close') return v.circle === 'Close Friends';
    return true;
  });

  const toggleLike = (id) => {
    setVideos(prev => prev.map(vid => {
      if (vid.id === id) {
        return {
          ...vid,
          isLiked: !vid.isLiked,
          likes: vid.isLiked ? vid.likes - 1 : vid.likes + 1
        };
      }
      return vid;
    }));
  };

  const toggleBookmark = (id) => {
    setVideos(prev => prev.map(vid => {
      if (vid.id === id) {
        return { ...vid, isBookmarked: !vid.isBookmarked };
      }
      return vid;
    }));
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeCommentVideo) return;

    const newCommentObj = {
      id: Date.now().toString(),
      user: 'you_dev',
      text: newCommentText,
      time: 'Just now'
    };

    setVideos(prev => prev.map(vid => {
      if (vid.id === activeCommentVideo.id) {
        return {
          ...vid,
          commentsCount: vid.commentsCount + 1,
          comments: [...vid.comments, newCommentObj]
        };
      }
      return vid;
    }));

    setActiveCommentVideo(prev => prev ? {
      ...prev,
      commentsCount: prev.commentsCount + 1,
      comments: [...prev.comments, newCommentObj]
    } : null);

    setNewCommentText('');
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newVideoUrl) return;

    const newPost = {
      id: `v_${Date.now()}`,
      url: newVideoUrl,
      author: 'you_dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      caption: newCaption || 'New vibe drop 🎥✨',
      likes: 0,
      commentsCount: 0,
      isLiked: false,
      isBookmarked: false,
      circle: selectedCircle,
      songTitle: 'Original Audio - you_dev',
      comments: []
    };

    setVideos([newPost, ...videos]);
    setIsCreateOpen(false);
    setNewVideoUrl('');
    setNewCaption('');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950 text-white font-sans antialiased">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md h-[100vh] sm:h-[844px] bg-black sm:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col border border-slate-800">

        {/* Top Header Overlay (Only on feed tab) */}
        {activeTab === 'feed' && (
          <div className="absolute top-0 left-0 right-0 z-30 pt-4 pb-2 px-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Sparkles className="w-5 h-5 text-pink-500" />
                <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-pink-500 to-violet-400 bg-clip-text text-transparent">
                  VibeTribe
                </span>
              </div>
              
              <div className="flex bg-slate-900/80 backdrop-blur-md p-1 rounded-full border border-slate-800">
                <button 
                  onClick={() => setFeedFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${feedFilter === 'all' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400'}`}
                >
                  All Friends
                </button>
                <button 
                  onClick={() => setFeedFilter('close')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${feedFilter === 'close' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'}`}
                >
                  Close Circle
                </button>
              </div>
            </div>

            {/* Friend Stories Scrollable Bar */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
              {INITIAL_STORIES.map(story => (
                <div key={story.id} className="flex flex-col items-center gap-1 min-w-[56px]">
                  <div className={`p-[2px] rounded-full ${story.hasStory ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600' : 'bg-slate-700'}`}>
                    <img 
                      src={story.avatar} 
                      alt={story.user}
                      className="w-11 h-11 rounded-full object-cover border-2 border-black" 
                    />
                  </div>
                  <span className="text-[10px] text-slate-300 tracking-tight truncate max-w-[54px]">
                    {story.user}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MAIN CONTENT CANVAS */}
        <div className="flex-1 relative overflow-hidden">
          {activeTab === 'feed' && (
            <div 
              ref={containerRef}
              onScroll={handleScroll}
              className="h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
            >
              {filteredVideos.map((video, idx) => (
                <VideoCard 
                  key={video.id}
                  video={video}
                  isActive={idx === currentVideoIndex}
                  isMuted={isMuted}
                  onToggleMute={() => setIsMuted(!isMuted)}
                  onLike={() => toggleLike(video.id)}
                  onBookmark={() => toggleBookmark(video.id)}
                  onOpenComments={() => setActiveCommentVideo(video)}
                />
              ))}
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="h-full p-6 bg-slate-900 overflow-y-auto pt-16">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="text-pink-500" /> Friend Activity
              </h2>
              <div className="space-y-4">
                {INITIAL_STORIES.slice(1).map((friend) => (
                  <div key={friend.id} className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <img src={friend.avatar} className="w-12 h-12 rounded-full object-cover" alt="" />
                      <div>
                        <div className="font-semibold text-sm">{friend.user}</div>
                        <div className="text-xs text-slate-400">Posted 2 new vibes today</div>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-pink-600/20 text-pink-400 border border-pink-500/30 rounded-lg text-xs font-medium">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="h-full p-6 bg-slate-950 overflow-y-auto pt-12">
              <div className="flex flex-col items-center">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                  className="w-24 h-24 rounded-full border-4 border-pink-500 p-1 object-cover"
                  alt="Profile"
                />
                <h3 className="font-bold text-lg mt-3">@you_dev</h3>
                <p className="text-xs text-slate-400 max-w-[200px] text-center mt-1">Building mini apps for friends & testing cool ideas ✨</p>
                
                <div className="flex gap-6 my-4 py-2 border-y border-slate-800 w-full justify-center">
                  <div className="text-center">
                    <div className="font-bold text-base">14</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-base">88</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Friends</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-base">1.2k</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Likes</div>
                  </div>
                </div>

                {/* Grid of videos */}
                <div className="w-full grid grid-cols-3 gap-2">
                  {videos.map(v => (
                    <div key={v.id} className="aspect-[9/16] bg-slate-800 rounded-lg overflow-hidden relative border border-slate-700">
                      <video src={v.url} className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 left-1 flex items-center gap-1 text-[10px] font-bold bg-black/50 px-1 rounded">
                        <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> {v.likes}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM NAVIGATION BAR */}
        <div className="h-16 bg-black/95 backdrop-blur-lg border-t border-slate-800/80 flex justify-around items-center px-4 z-30">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'feed' ? 'text-pink-500' : 'text-slate-500'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('friends')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'friends' ? 'text-pink-500' : 'text-slate-500'}`}
          >
            <Users className="w-6 h-6" />
            <span className="text-[10px] font-medium">Friends</span>
          </button>

          <button 
            onClick={() => setIsCreateOpen(true)}
            className="w-12 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/20 active:scale-95 transition-transform"
          >
            <PlusSquare className="w-5 h-5 text-white" />
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-pink-500' : 'text-slate-500'}`}
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>

        {/* COMMENTS MODAL DRAWER */}
        {activeCommentVideo && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
            <div className="bg-slate-900 border-t border-slate-700 rounded-t-3xl h-[65%] flex flex-col p-4 animate-in slide-in-from-bottom duration-200">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="font-semibold text-sm">{activeCommentVideo.commentsCount} Comments</span>
                <button onClick={() => setActiveCommentVideo(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {activeCommentVideo.comments.length === 0 ? (
                  <div className="text-center text-slate-500 text-xs py-8">Be the first friend to comment!</div>
                ) : (
                  activeCommentVideo.comments.map(c => (
                    <div key={c.id} className="flex gap-3 text-xs">
                      <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center font-bold text-pink-400">
                        {c.user[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-slate-300 mr-2">@{c.user}</span>
                        <span className="text-slate-100">{c.text}</span>
                        <div className="text-[10px] text-slate-500 mt-0.5">{c.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <input 
                  type="text"
                  placeholder="Add a comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 bg-slate-800 text-xs rounded-full px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
                <button type="submit" className="p-2 bg-pink-600 rounded-full text-white">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* CREATE POST MODAL */}
        {isCreateOpen && (
          <div className="absolute inset-0 z-50 bg-slate-950 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Sparkles className="text-pink-500" /> Post a Friend Vibe
                </h3>
                <button onClick={() => setIsCreateOpen(false)} className="text-slate-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Direct Video MP4 Link</label>
                  <input 
                    type="url" 
                    placeholder="https://assets.mixkit.co/..."
                    required
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs focus:ring-1 focus:ring-pink-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Use any direct MP4 video link to display</span>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Caption</label>
                  <textarea 
                    rows={3}
                    placeholder="What's happening?"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs focus:ring-1 focus:ring-pink-500 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Target Circle Audience</label>
                  <select 
                    value={selectedCircle}
                    onChange={(e) => setSelectedCircle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs focus:ring-1 focus:ring-pink-500 outline-none"
                  >
                    <option value="Close Friends">Close Friends Only</option>
                    <option value="Skate Squad">Skate Squad</option>
                    <option value="Party Squad">Party Squad</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-pink-600/30 mt-4"
                >
                  Share to Tribe
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Single Video Card Component inside feed
function VideoCard({ video, isActive, isMuted, onToggleMute, onLike, onBookmark, onOpenComments }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="w-full h-full snap-start relative flex-shrink-0 bg-slate-900">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.url}
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Play/Pause Overlay indicator when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Audio Mute Controller Toggle */}
      <button 
        onClick={onToggleMute}
        className="absolute top-24 right-4 z-20 w-9 h-9 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10"
      >
        {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
      </button>

      {/* Right Side Action Buttons */}
      <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-5">
        <button onClick={onLike} className="group flex flex-col items-center">
          <div className="w-11 h-11 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center group-active:scale-125 transition-transform">
            <Heart className={`w-6 h-6 ${video.isLiked ? 'text-pink-500 fill-pink-500' : 'text-white'}`} />
          </div>
          <span className="text-[11px] font-bold mt-1 shadow-sm">{video.likes}</span>
        </button>

        <button onClick={onOpenComments} className="flex flex-col items-center">
          <div className="w-11 h-11 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-[11px] font-bold mt-1 shadow-sm">{video.commentsCount}</span>
        </button>

        <button onClick={onBookmark} className="flex flex-col items-center">
          <div className="w-11 h-11 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center">
            <Bookmark className={`w-6 h-6 ${video.isBookmarked ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`} />
          </div>
        </button>

        <button className="flex flex-col items-center">
          <div className="w-11 h-11 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" />
          </div>
        </button>
      </div>

      {/* Bottom Info Details */}
      <div className="absolute bottom-4 left-4 right-16 z-20 space-y-2">
        <div className="flex items-center gap-2">
          <img src={video.avatar} className="w-9 h-9 rounded-full object-cover border-2 border-pink-500" alt="" />
          <span className="font-bold text-sm">@{video.author}</span>
          <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full font-medium">
            {video.circle}
          </span>
        </div>

        <p className="text-xs text-slate-100 line-clamp-2 leading-relaxed">{video.caption}</p>

        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <Music className="w-3.5 h-3.5 animate-spin" />
          <span className="truncate text-[11px]">{video.songTitle}</span>
        </div>
      </div>

      {/* Subtle Shadow Gradient Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
    </div>
  );
}+++++
