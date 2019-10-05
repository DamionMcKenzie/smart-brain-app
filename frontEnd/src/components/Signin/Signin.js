import React from 'react';


class Signin extends React.Component {

	//note that the constructor and super has props here
	constructor(props){
		super(props);

		this.state = {
			signInEmail: '',
			signInPassword: ''
		}
	}


	// functions here to work only on the signin component
	// other components may have a replica of these functions to use on their components if needed
	onEmailChange = (event) =>{
		this.setState({signInEmail: event.target.value});
	}



	onPasswordChange = (event) =>{
		this.setState({signInPassword: event.target.value});
	}



	onSubmitSignIn = ()=>{

		fetch('http://localhost:3000/signin', {
			method : 'post',
			headers : {'Content-Type': 'application/json'},
			body : JSON.stringify({
				// where does this email and password variable live that is being set here
				email : this.state.signInEmail,
				password : this.state.signInPassword
			})
		})
		// what does this statement here do 
		.then(response => response.json())
		.then(user =>{
			//where does ID come from 
			// I think ID is created automatically after registration
			if(user.id){	
			
			this.props.loadUser(user);
			this.props.onRouteChange('home');

			}
		})
	}

	render(){

	const {onRouteChange} = this.props;	

		return (

			<article className="br6 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">

				<main className="pa4 black-80">
				  <div className="measure ">
				    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				    {/*note this legend here*/}
				      <legend className="f1 fw6 ph0 mh0">Sign In</legend>
				      <div className="mt3">
				     {/* note this label here*/}
				        <label className="db fw6 lh-copy f6" htmlFor ="email-address">Email</label>
				        <input
				        className=" pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
				         type="email"
				          name="email-address" 
				           id="email-address"
				          //note this onChange function here. Get to know how it works
				           onChange={this.onEmailChange}
				           />

				      </div>
				      <div className="mv3">
				      {/*note this label here*/}
				        <label className="db fw6 lh-copy f6" htmlFor ="password">Password</label>
				        <input 
				        className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
				         type="password"
				  		 name="password"  
				         id="password"
				          //note this onChange function here. Get to know how it works
				         onChange={this.onPasswordChange}
				         />
				      </div>
				    </fieldset>
				    <div className="">
				      <input 
				       //note this onClick function here. Get to know how it works
				      onClick = {this.onSubmitSignIn}
				      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
				       type="submit"
				        value="Sign in"
				        />
				    </div>
				    <div className="lh-copy mt3">
				    {/*linking to the register form here*/}
				      <p 
				       onClick = {() =>onRouteChange('register')}
				        className="f6 link dim black db pointer ">Register
				       </p>
				    </div>
				  </div>
				</main>

			</article>
	     ); 
	}


}


export default Signin;