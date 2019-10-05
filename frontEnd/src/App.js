import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';

//note particles component here. It is here for the entire app and not for any particular component 
// Also here to be displayed in the app
import Particles from 'react-particles-js';

import Register from './components/Register/Register';
import './App.css';



const particlesOptions = {
	  particles: {
       number:{
       	value:300,
       	density:{
       		enable: true,
       		value_area:800
       	 }
       }
   	}
}


// To help clear the state of the app so one's information is hidden when another person is logged in
//why is initial state not apart of the smart component? find out the real reason why having initial 
// state as an external object help to clear the state
const initialState = {
			input:'',
			imageUrl:'',
			box: {},
			route: 'signin',
			isSignedIn: false,
			user : {
					id: '',
					name: '',
					email:'',
					entries: 0,
					joined: ''

				}

	}




class App extends Component {


	// constructor within a smart component with super being called in order to use the constructor
	constructor(){

		super();

		this.state = initialState;
		
	}



				loadUser = (data) =>{


					//setting the state to an object here. An object is a javascript expression hence 
					//the curly braces to hold the user object
					// user is the key in the object and its value is another object
					this.setState({user :{
						id: data.id,
						name: data.name,
						email:data.email,
						entries: data.entries,
						joined: data.joined


					}})
				}



				calculateFaceLocation = (data) =>{

					const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
					const image = document.getElementById('inputimage');
					const width = Number(image.width);
					const height = Number(image.height);

					return {

						leftCol : clarifaiFace.left_col * width,
						topRow : clarifaiFace.top_row * height,
						rightCol : width - (clarifaiFace.right_col * width),
						bottomRow : height - (clarifaiFace.bottom_row * height)
					}
				}



				displayFaceBox = (box) =>{

						this.setState({box: box});
				} 


				onButtonSubmit = () =>{

				this.setState({imageUrl: this.state.input});

							fetch('http://localhost:3000/imageurl', {
								method : 'post',
								headers : {'Content-Type': 'application/json'},
								body : JSON.stringify({

								input : this.state.input 

								})	
							})
							// what does this do 
							.then(response => response.json)
					.then( response => {
						if(response){
							fetch('http://localhost:3000/image', {
								method : 'put',
								headers : {'Content-Type': 'application/json'},
								body : JSON.stringify({

								id : this.state.user.id 

								})	
							})

							.then(response => response.json())
							.then(count =>{
								this.setState(Object.assign(this.state.user, {entries : count}))
							})
							.catch(console.log)
						}
						this.displayFaceBox(this.calculateFaceLocation(response))
					})
					.catch(err => console.log(err));
				}



				onInputChange = (event) =>{
					this.setState({input:event.target.value});
				}		




				onRouteChange =  (route) =>{

					if(route === 'signout'){
						this.setState(initialState)
					}else if(route === 'home'){
						this.setState({isSignedIn:true})
					}


					this.setState({route:route});
				}


				render(){

				const {isSignedIn, imageUrl, route, box} = this.state;


				/*whatever is returned is what is shown in the app*/
				return(

						<div className="App">

								<Particles
								 className = 'particles'
								  params={particlesOptions}
								/>

								<Navigation 
								isSignedIn= {isSignedIn}
								onRouteChange = {this.onRouteChange}
								 />  
 
								{/*this statement here is doing the quaternary expression
								It is wrapped in curly braces because this is a javascript expression also*/}

								{route === 'home'

									 ?<div>

									 		 <Logo/>

									 		 <Rank
									 		 name = {this.state.user.name}
									 		 entries = {this.state.user.entries}
									 		 />

									 		{/*This is probably the component for the button*/}

											 <ImageLinkForm 
											 onInputChange = {this.onInputChange} 
											 onButtonSubmit = {this.onButtonSubmit}
											 />

						 				<FaceRecognition 
						 				box = {box} 
						 				imageUrl={imageUrl}
						 				/>

						 			</div>

						 				// why have parentheses here instead of curly braces
						 				// curly braces gives errors
						 				// I tried tried div and both the signin and register form were displayed 
									 :
									 (
											 	route === 'signin'
		 
												? 
												<Signin 
											 	onRouteChange = {this.onRouteChange}
											 	loadUser = {this.loadUser} 
											 	/> 

											 	:

											 	 <Register 
											 	onRouteChange = {this.onRouteChange}
											 	loadUser = {this.loadUser}
											 	/> 
											 

										)

								}

						</div>
					);
				}


}



export default App;