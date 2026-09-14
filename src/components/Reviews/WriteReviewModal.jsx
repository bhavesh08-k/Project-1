import { useState } from 'react'
import Button from '../Button'
import { POPULAR_REVIEW_TAGS } from '../../data/reviews'

export default function WriteReviewModal({ movie, user, onClose, onSubmit }) {
  const [rating, setRating] = useState(8)
  const [hoverRating, setHoverRating] = useState(0)
  const [verdict, setVerdict] = useState('must-watch') // 'must-watch', 'worth-it', 'skip'
  const [headline, setHeadline] = useState('')
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [hasSpoilers, setHasSpoilers] = useState(false)
  const [error, setError] = useState('')

  const ratingDescriptions = {
    10: 'Masterpiece 🏆',
    9: 'Fantastic 🔥',
    8: 'Great Watch 👍',
    7: 'Good & Entertaining ✨',
    6: 'Decent One-Time Watch 👌',
    5: 'Average / Mixed 😐',
    4: 'Underwhelming 😕',
    3: 'Poor 👎',
    2: 'Bad 🚫',
    1: 'Terrible 💀',
  }

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!headline.trim()) {
      setError('Please add a short headline for your review.')
      return
    }
    if (content.trim().length < 20) {
      setError('Please write at least 20 characters explaining your opinion.')
      return
    }

    const reviewData = {
      movieId: movie.id,
      authorName: user?.name || 'Anonymous Cinephile',
      authorEmail: user?.email || '',
      rating: Number(rating),
      verdict,
      headline: headline.trim(),
      content: content.trim(),
      tags: selectedTags,
      hasSpoilers,
    }

    onSubmit(reviewData)
    onClose()
  }

  const activeScore = hoverRating || rating

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal review-modal"
        style={{ width: 'min(640px, 100%)', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="write-review-title"
      >
        <div className="review-modal-header">
          <div>
            <p className="kicker">Audience Review</p>
            <h2 id="write-review-title" style={{ margin: '4px 0 0' }}>
              Review {movie.title}
            </h2>
            <p className="muted" style={{ fontSize: '0.88rem' }}>
              Posting as <strong style={{ color: 'var(--ivory)' }}>{user?.name}</strong>
            </p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          {/* Rating 1-10 selector */}
          <div className="review-form-group">
            <label className="review-label">
              Your Rating:{' '}
              <strong style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>
                ★ {activeScore}/10
              </strong>{' '}
              <span className="muted" style={{ fontWeight: 400, marginLeft: 6 }}>
                ({ratingDescriptions[activeScore]})
              </span>
            </label>
            <div className="star-rating-bar">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-button ${activeScore >= star ? 'active' : ''}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} out of 10`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Verdict decision selection */}
          <div className="review-form-group">
            <label className="review-label">Would you recommend this movie?</label>
            <div className="verdict-options-grid">
              <button
                type="button"
                className={`verdict-btn ${verdict === 'must-watch' ? 'selected must-watch' : ''}`}
                onClick={() => setVerdict('must-watch')}
              >
                <span className="verdict-emoji">🏆</span>
                <strong>Must Watch</strong>
                <span className="verdict-sub">Demands a big screen</span>
              </button>

              <button
                type="button"
                className={`verdict-btn ${verdict === 'worth-it' ? 'selected worth-it' : ''}`}
                onClick={() => setVerdict('worth-it')}
              >
                <span className="verdict-emoji">🎟️</span>
                <strong>Worth a Watch</strong>
                <span className="verdict-sub">Good entertainment</span>
              </button>

              <button
                type="button"
                className={`verdict-btn ${verdict === 'skip' ? 'selected skip' : ''}`}
                onClick={() => setVerdict('skip')}
              >
                <span className="verdict-emoji">🛋️</span>
                <strong>Wait for OTT / Skip</strong>
                <span className="verdict-sub">Save your money</span>
              </button>
            </div>
          </div>

          {/* Headline */}
          <div className="review-form-group">
            <label className="review-label">Review Headline</label>
            <input
              type="text"
              className="field"
              placeholder="e.g. An absolute visual triumph! / Disappointing second half"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              maxLength={120}
            />
          </div>

          {/* Review Detailed Body */}
          <div className="review-form-group">
            <label className="review-label">Detailed Review</label>
            <textarea
              className="field review-textarea"
              rows={4}
              placeholder="What did you love or dislike about the story, performances, visuals, or music? Help others decide whether to book tickets."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Impression Tags Multi-Select */}
          <div className="review-form-group">
            <label className="review-label">Key Impressions (Select tags)</label>
            <div className="tags-select-cloud">
              {POPULAR_REVIEW_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    className={`tag-toggle-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Spoilers toggle */}
          <div className="review-form-group review-spoiler-toggle">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={hasSpoilers}
                onChange={(e) => setHasSpoilers(e.target.checked)}
              />
              <span>This review contains spoilers (will be masked by default)</span>
            </label>
          </div>

          {error && <p className="error">{error}</p>}

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Post Review</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
