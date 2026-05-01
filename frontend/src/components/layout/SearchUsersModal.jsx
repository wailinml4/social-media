import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import toast from 'react-hot-toast';

import { useModal } from '../../context/ModalContext';
import { searchUsers } from '../../services/userService';

const SearchUsersModal = () => {
  const { isSearchModalOpen, closeSearchModal } = useModal();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSearchModalOpen) {
      setQuery('');
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    inputRef.current?.focus();
  }, [isSearchModalOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await searchUsers({ query: query.trim(), limit: 8 });
        setResults(data.users || []);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Search failed');
        toast.error('Unable to search users');
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleClose = () => {
    closeSearchModal();
  };

  const handleUserClick = (userId) => {
    closeSearchModal();
    navigate(`/profile/${userId}`);
  };

  const memoizedResults = useMemo(() => results, [results]);

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xl"
        onClick={handleClose}
      />

      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#050505] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-white">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Search users</h2>
              <p className="text-sm text-white/60">Type a name or handle to find someone.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/55 transition-all duration-200 hover:bg-white/5 hover:text-white"
            aria-label="Close search"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/40">
              <Search className="h-4 w-4" />
            </div>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users"
              className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="max-h-[380px] overflow-y-auto px-5 pb-5">
          {query.trim() === '' ? null : loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
              Searching...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-red-400">
              {error}
            </div>
          ) : memoizedResults.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
              No users found.
            </div>
          ) : (
            <div className="space-y-2">
              {memoizedResults.map((user) => (
                <button
                  type="button"
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className="flex w-full items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/10">
                    <img
                      src={user.profilePicture || 'https://i.pravatar.cc/150?u=' + user._id}
                      alt={user.fullName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{user.fullName}</p>
                    <p className="truncate text-sm text-white/50">@{user.email?.split('@')[0]}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUsersModal;
