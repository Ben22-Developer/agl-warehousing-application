import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserData } from '../../../redux/slice/user/UserSlice.js'
import './UserProfile.css'
import ImageComponent from "../../image/ImageComponent.jsx";

function UserProfile() {
  const dispatch = useDispatch()
  const { user, onFetch, onFetchSuccess, onFetchError, onFetchErrorMessage } = useSelector((state) => state.user)

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      dispatch(fetchUserData())
    }
  }, [dispatch, user])

  const handleUpdate = () => {
    console.log('Update user profile clicked', user)
  }

  const handleDelete = () => {
    console.log('Delete user profile clicked', user)
  }

  if (onFetch) {
    return <div className="user-profile-loading">Loading...</div>
  }

  if (onFetchError) {
    return <div className="user-profile-error">Error: {onFetchErrorMessage}</div>
  }

  if (!onFetchSuccess || !user || Object.keys(user).length === 0) {
    return <div className="user-profile-empty">No user data available</div>
  }

  console.log(user)

  return (
    <div className="user-profile-container">
      <div className="user-profile-card">
        <div className="user-profile-header">
          <div className="user-profile-avatar">
            <ImageComponent url={user.profilePicture} alt="Profile" className="user-profile-image" />
          </div>
          <div className="user-profile-info">
            <h2 className="user-profile-name">{user.name || 'Unknown'}</h2>
            <p className="user-profile-username">@{user.username || 'unknown'}</p>
            <span className="user-profile-role">{user.role?.name || 'No Role'}</span>
          </div>
        </div>

        <div className="user-profile-details">
          <div className="user-profile-detail-item">
            <span className="user-profile-detail-label">Username:</span>
            <span className="user-profile-detail-value">{user.username || 'N/A'}</span>
          </div>
          <div className="user-profile-detail-item">
            <span className="user-profile-detail-label">Full Name:</span>
            <span className="user-profile-detail-value">{user.name || 'N/A'}</span>
          </div>
          <div className="user-profile-detail-item">
            <span className="user-profile-detail-label">Role:</span>
            <span className="user-profile-detail-value">{user.role?.name || 'N/A'}</span>
          </div>
        </div>

        <div className="user-profile-actions">
          <button className="user-profile-btn user-profile-btn-update" onClick={handleUpdate}>
            Update Profile
          </button>
          <button className="user-profile-btn user-profile-btn-delete" onClick={handleDelete}>
            Delete Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
