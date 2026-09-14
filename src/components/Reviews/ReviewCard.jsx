import { useState } from 'react'
import { toggleReviewHelpful, getUserVotedReviewIds } from '../../utils/storage'

export default function ReviewCard({ review, currentUser, onDelete, onVoteChange }) {
  const [showSpoiler, setShowSpoiler] = useState(false)
  const votedIds = getUserVotedReviewIds()
  const isHelpful = votedIds.includes(review.id)
  const [likesCount, setLikesCount] = useState(review.likes || 0)
  const [hasVoted, setHasVoted] = useState(isHelpful)

  const handleVote = () => {
    const res = toggleReviewHelpful(review.id)
    setHasVoted(res.hasVoted)
    setLikesCount((prev) => Math.max(0, prev + res.diff))
    if (onVoteChange) onVoteChange()
  }

  const isAuthor =
    currentUser &&
    ((review.authorEmail && currentUser.email === review.authorEmail) ||
      currentUser.name === review.authorName)

  // Verdict details
  const verdictConfig = {
    'must-watch': { label: 'Must Watch', emoji: '🏆', className: 'verdict-must-watch' },
    'worth-it': { label: 'Worth It', emoji: '🎟️', className: 'verdict-worth-it' },
    'skip': { label: 'Skip / OTT', emoji: '🛋️', className: 'verdict-skip' },
  }
  const verdict = verdictConfig[review.verdict] || verdictConfig['worth-it']

  // Initials for avatar
  const initials = (review.authorName || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <article className="review-card">
      <div className="review-card-header">
        <div className="review-author-info">
          <div className="review-avatar" aria-hidden="true">
            {initials}
          </div>
          <div>
            <div className="review-author-row">
              <span className="review-author-name">{review.authorName}</span>
              {review.verifiedBooking && (
                <span className="review-verified-badge" title="Verified Ticket Holder">
                  ✓ Verified Viewer
                </span>
              )}
            </div>
            <span className="review-date">{review.date}</span>
          </div>
        </div>

        <div className="review-badges-row">
          <div className="review-rating-chip">★ {review.rating}<span>/10</span></div>
          <span className={`review-verdict-pill ${verdict.className}`}>
            {verdict.emoji} {verdict.label}
          </span>
        </div>
      </div>

      <h4 className="review-headline">{review.headline}</h4>

      {/* Review Body with optional spoiler masking */}
      {review.hasSpoilers && !showSpoiler ? (
        <div className="review-spoiler-box">
          <span className="review-spoiler-warning">⚠️ Contains spoilers</span>
          <button
            type="button"
            className="btn btn-ghost review-spoiler-btn"
            onClick={() => setShowSpoiler(true)}
          >
            Click to reveal review
          </button>
        </div>
      ) : (
        <p className="review-content">{review.content}</p>
      )}

      {/* Tags */}
      {review.tags && review.tags.length > 0 && (
        <div className="review-tags-row">
          {review.tags.map((tag) => (
            <span key={tag} className="review-tag-chip">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer / Actions */}
      <div className="review-card-footer">
        <button
          type="button"
          className={`review-helpful-btn ${hasVoted ? 'voted' : ''}`}
          onClick={handleVote}
          title="Mark this review as helpful"
        >
          <span className="helpful-icon">👍</span>
          <span>Helpful ({likesCount})</span>
        </button>

        {isAuthor && onDelete && (
          <button
            type="button"
            className="review-delete-btn"
            onClick={() => onDelete(review.id)}
            title="Delete your review"
          >
            Delete
          </button>
        )}
      </div>
    </article>
  )
}
