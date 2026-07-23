import { Typography, List, ListItem, ListItemText, ListItemIcon, Paper } from '@mui/material'
import ArticleIcon from '@mui/icons-material/Article'

const UserView = ({ user }) => {
  if (!user) {
    return null
  }

  return (
    <Paper sx={{ p: 3, mt: 3, maxWidth: 600 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {user.name || user.username}
      </Typography>
      <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
        Added Blogs
      </Typography>
      {user.blogs && user.blogs.length > 0 ? (
        <List>
          {user.blogs.map(blog => (
            <ListItem key={blog.id || blog} divider>
              <ListItemIcon>
                <ArticleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={blog.title || blog} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          No blogs added yet.
        </Typography>
      )}
    </Paper>
  )
}

export default UserView