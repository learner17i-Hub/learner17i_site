import { GithubOutlined } from '@ant-design/icons'

export default function Footer() {
  return (
    <footer style={{
      textAlign: 'center', padding: '24px 16px',
      background: '#001529', color: 'rgba(255,255,255,0.65)',
      fontSize: 14,
    }}>
      <div style={{ marginBottom: 8 }}>
        <a
          href="https://github.com/learner17i-Hub"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'rgba(255,255,255,0.85)', marginRight: 16 }}
        >
          <GithubOutlined /> GitHub
        </a>
      </div>
      <div>&copy; {new Date().getFullYear()} Learner17i. Built with Django + React.</div>
    </footer>
  )
}
