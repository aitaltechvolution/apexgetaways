// Itineraries — stub placeholder
import { Link } from 'react-router-dom'
export default function Itineraries() {
  return (
    <div style={{minHeight:'60vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'12px',padding:'40px'}}>
      <h2 style={{fontSize:'20px',fontWeight:'bold',color:'#0057B8'}}>Itineraries</h2>
      <Link to="/" style={{color:'#0057B8',fontWeight:'600',fontSize:'14px'}}>← Back to Home</Link>
    </div>
  )
}