import './App.css'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import Header from './components/Header'
import ProjectCard from './components/ProjectCard'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class App extends Component {
  state = {
    activeId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjectsList()
  }

  getProjectsList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeId}`
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok) {
      const {projects} = data
      const projectsList = projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        projectsList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickRetry = () => {
    this.getProjectsList()
  }

  /* Loading View */
  renderLoadingView = () => (
    <div data-testid='loader' className='loader-cont'>
      <Loader type='TailSpin' color='#00BFFF' height={50} width={50} />
    </div>
  )

  /* Failure View */
  renderFailureView = () => (
    <div className='failure-cont'>
      <img
        src='https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png'
        alt='failure view'
        className='failure-img'
      />
      <h1 className='failure-head'>Oops! Something Went Wrong</h1>
      <p className='failure-desc'>
        We cannot seem to find the page you are looking for.
      </p>
      <button type='button' className='retry-btn' onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <ul className='projects-list'>
        {projectsList.map(eachItem => (
          <ProjectCard key={eachItem.id} projectItem={eachItem} />
        ))}
      </ul>
    )
  }

  renderProjectsSection = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  onChangeProjectId = event => {
    this.setState({activeId: event.target.value}, this.getProjectsList)
  }

  render() {
    const {activeId} = this.state
    return (
      <div className='main-bg'>
        <Header />
        <div className='projects-cont'>
          <select
            className='select-element'
            value={activeId}
            onChange={this.onChangeProjectId}
          >
            {categoriesList.map(eachItem => (
              <option value={eachItem.id} key={eachItem.id}>
                {eachItem.displayText}
              </option>
            ))}
          </select>
          {this.renderProjectsSection()}
        </div>
      </div>
    )
  }
}

export default App
