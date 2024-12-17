import './index.css'

const ProjectCard = props => {
  const {projectItem} = props
  const {name, imageUrl} = projectItem
  return (
    <li className="project-item">
      <img src={imageUrl} alt={name} className="project-card-img" />
      <p className="name">{name} </p>
    </li>
  )
}

export default ProjectCard
