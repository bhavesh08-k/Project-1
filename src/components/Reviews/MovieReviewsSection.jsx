import { useMemo, useState } from 'react'
import Button from '../Button'
import ReviewCard from './ReviewCard'
import WriteReviewModal from './WriteReviewModal'
import { useApp } from '../../context/AppContext'
import {
  calculateMovieVerdict,
  deleteUserReview,
  getMovieReviews,
  saveUserReview,
} from '../../utils/storage'

export default function MovieReviewsSection({ movie }) {
  const { user, setLoginModalOpen, reviewsVersion, triggerReviewsRefresh } = useApp()
  const [writeModalOpen, setWriteModalOpen] = useState(false)
  const [filterVerdict, setFilterVerdict] = useState('all') // 'all', 'must-watch', 'worth-it', 'skip', 'spoilers', 'verified'
  const [sortBy, setSortBy] = useState('helpful') // 'helpful', 'newest', 'rating-high', 'rating-low'
  const [toastMessage, setToastMessage] = useState('')

  // Retrieve reviews for this movie
  const reviews = useMemo(() => {
    return getMovieReviews(movie.id, reviewsVersion)
  }, [movie.id, reviewsVersion])

  // Calculate Moctale-inspired audience verdict & decision metrics
  const verdictData = useMemo(() => {
    return calculateMovieVerdict(reviews, movie.rating)
  }, [reviews, movie.rating])

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let result = [...reviews]

    if (filterVerdict === 'must-watch') {
      result = result.filter((r) => r.verdict === 'must-watch')
    } else if (filterVerdict === 'worth-it') {
      result = result.filter((r) => r.verdict === 'worth-it')
    } else if (filterVerdict === 'skip') {
      result = result.filter((r) => r.verdict === 'skip')
    } else if (filterVerdict === 'spoilers') {
      result = result.filter((r) => r.hasSpoilers)
    } else if (filterVerdict === 'verified') {
      result = result.filter((r) => r.verifiedBooking)
    }

    result.sort((a, b) => {
      if (sortBy === 'helpful') return (b.likes || 0) - (a.likes || 0)
      if (sortBy === 'newest') return new Date(b.date || 0) - new Date(a.date || 0)
      if (sortBy === 'rating-high') return b.rating - a.rating
      if (sortBy === 'rating-low') return a.rating - b.rating
      return 0
    })

    return result
  }, [reviews, filterVerdict, sortBy])

  const handleWriteClick = () => {
    if (!user) {
      if (setLoginModalOpen) setLoginModalOpen(true)
    } else {
      setWriteModalOpen(true)
    }
  }

  const handleReviewSubmit = (reviewData) => {
    saveUserReview(reviewData)
    triggerReviewsRefresh()
    setToastMessage('Your review has been posted! Thank you for helping fellow viewers decide.')
    setTimeout(() => setToastMessage(''), 4500)
  }

  const handleReviewDelete = (reviewId) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      deleteUserReview(reviewId)
      triggerReviewsRefresh()
    }
  }

  return (
    <section className="reviews-section" id="reviews">
      <div className="section-header-row">
        <div>
          <p className="kicker">Audience Pulse · Moctale Insights</p>
          <h2 className="section-title">Should You Watch This?</h2>
          <p className="muted">
            Aggregated audience verdict and honest reviews from verified movie-goers.
          </p>
        </div>

        <div className="section-header-actions">
          {user ? (
            <Button onClick={handleWriteClick}>+ Write a Review</Button>
          ) : (
            <Button variant="ghost" onClick={handleWriteClick}>
              Sign in to Review
            </Button>
          )}
        </div>
      </div>

      {toastMessage && <div className="review-toast">{toastMessage}</div>}

      {/* 1. DECISION SUMMARY BANNER (Moctale-style) */}
      <div className="verdict-banner-box">
        <div className="verdict-main-col">
          <div className="verdict-badge-pill">
            <span className="verdict-badge-icon">{verdictData.verdictBadge.emoji}</span>
            <div>
              <span className="verdict-badge-kicker">COMMUNITY VERDICT</span>
              <h3 className="verdict-badge-title">{verdictData.verdictBadge.label}</h3>
            </div>
          </div>

          <div className="verdict-score-row">
            <div className="verdict-stat-item">
              <span className="verdict-stat-num">{verdictData.recommendPercent}%</span>
              <span className="verdict-stat-label">Would Recommend</span>
            </div>
            <div className="verdict-divider" />
            <div className="verdict-stat-item">
              <span className="verdict-stat-num">★ {verdictData.avgRating}</span>
              <span className="verdict-stat-label">Average Audience Score</span>
            </div>
            <div className="verdict-divider" />
            <div className="verdict-stat-item">
              <span className="verdict-stat-num">{verdictData.totalCount}</span>
              <span className="verdict-stat-label">Total Reviews</span>
            </div>
          </div>

          {/* Key Audience Impressions */}
          {verdictData.topTags && verdictData.topTags.length > 0 && (
            <div className="verdict-tags-group">
              <span className="muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                KEY AUDIENCE IMPRESSIONS:
              </span>
              <div className="verdict-tags-list">
                {verdictData.topTags.map((tag) => (
                  <span key={tag} className="verdict-tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Callout Prompt for non-logged in or review writing */}
        <div className="verdict-cta-col">
          <div className="verdict-cta-card">
            <h4>Watched {movie.title}?</h4>
            <p className="muted">
              {user
                ? 'Your feedback helps other film enthusiasts make up their minds.'
                : 'Log in to rate the movie and guide fellow viewers.'}
            </p>
            <Button
              style={{ width: '100%', marginTop: 8 }}
              onClick={handleWriteClick}
            >
              {user ? 'Rate & Review' : 'Sign In to Review'}
            </Button>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SORT TOOLBAR */}
      <div className="reviews-toolbar">
        <div className="reviews-filter-chips">
          <button
            type="button"
            className={`filter-chip ${filterVerdict === 'all' ? 'active' : ''}`}
            onClick={() => setFilterVerdict('all')}
          >
            All ({reviews.length})
          </button>
          <button
            type="button"
            className={`filter-chip ${filterVerdict === 'must-watch' ? 'active' : ''}`}
            onClick={() => setFilterVerdict('must-watch')}
          >
            🏆 Must Watch
          </button>
          <button
            type="button"
            className={`filter-chip ${filterVerdict === 'worth-it' ? 'active' : ''}`}
            onClick={() => setFilterVerdict('worth-it')}
          >
            🎟️ Worth It
          </button>
          <button
            type="button"
            className={`filter-chip ${filterVerdict === 'skip' ? 'active' : ''}`}
            onClick={() => setFilterVerdict('skip')}
          >
            🛋️ Skip / OTT
          </button>
          <button
            type="button"
            className={`filter-chip ${filterVerdict === 'verified' ? 'active' : ''}`}
            onClick={() => setFilterVerdict('verified')}
          >
            ✓ Verified
          </button>
        </div>

        <div className="reviews-sort-group">
          <label htmlFor="sort-reviews" className="muted" style={{ fontSize: '0.82rem' }}>
            Sort by:
          </label>
          <select
            id="sort-reviews"
            className="select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="helpful">Most Helpful</option>
            <option value="newest">Newest First</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* 3. REVIEWS LIST */}
      {filteredReviews.length === 0 ? (
        <div className="panel empty-reviews-panel">
          <p className="kicker">No reviews found</p>
          <h3>No reviews match the current filter</h3>
          <p className="muted">
            Try switching filters or be the first to post your thoughts on this title!
          </p>
          <Button style={{ marginTop: 12 }} onClick={handleWriteClick}>
            Write a Review
          </Button>
        </div>
      ) : (
        <div className="reviews-grid">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUser={user}
              onDelete={handleReviewDelete}
              onVoteChange={triggerReviewsRefresh}
            />
          ))}
        </div>
      )}

      {/* Write Review Modal */}
      {writeModalOpen && (
        <WriteReviewModal
          movie={movie}
          user={user}
          onClose={() => setWriteModalOpen(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </section>
  )
}
