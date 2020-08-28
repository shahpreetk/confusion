import React, { Component } from 'react'
import { Card, CardImg, CardImgOverlay,
		 CardText, CardBody, CardTitle,
		 Breadcrumb, BreadcrumbItem, Button,
		 Modal, ModalHeader, ModalBody, ModalFooter,
		 Row, Col, Label
	   } from 'reactstrap'
import { Link } from 'react-router-dom'
import { LocalForm, Control, Errors } from 'react-redux-form'
import { Loading } from './LoadingComponent'
import { baseUrl } from '../shared/baseUrl'
function RenderDish({dish}) {
		if(dish != null){
			return (
					<div className = 'col-12 col-md-5 m-1'>
						<Card>
							<CardImg width="100%" src={baseUrl + dish.image} alt={dish.name}/>
							<CardBody>
								<CardTitle>{dish.name}</CardTitle>
								<CardText>{dish.description}</CardText>
							</CardBody>
						</Card>
					</div>
			)
		}
	}


function RenderComments({comments, dishId, postComment}) {
		if(comments!= null){
			return (
				<div className = 'col-12 col-md-5 m-1'>
				{
					comments.map((comment, i) => {
						return (
							<ul className ='list-unstyled' key = {comment.id}>
								<li>
									<div>{comment.comment}</div>
								    <div>{`-- ${comment.author} , ${new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day:'2-digit'}).format(new Date(Date.parse(comment.date)))}`}</div>
								</li>
							</ul>
						)
					})
				}
				<CommentForm dishId = {dishId} postComment = {postComment}/>
				</div>

			)
		}
	}



const DishDetail = (props) => {
		if(props.isLoading) {
			return (
				<div className ='container'>
					<div className='row'>
						<Loading/>
					</div>
				</div>
			)
		}
		else if (props.errMess) {
			return(
				<div className ='container'>
					<div className='row'>
						<h4>{props.errMess}</h4>
					</div>
				</div>
			)
		}
		else if(props.dish != null)
		return (
			<div className ='container' >
				<div className = 'row'>
					<Breadcrumb>
						<BreadcrumbItem>
							<Link to='/home'>Home</Link>
						</BreadcrumbItem>
						<BreadcrumbItem>
							<Link to='/menu'>Menu</Link>
						</BreadcrumbItem>
						<BreadcrumbItem active>
							{props.dish.name}
						</BreadcrumbItem>
					</Breadcrumb>
					<div className = 'col-12'>
						<h3>{props.dish.name}</h3>
						<hr/>
					</div>
			    </div>
			    <div className = 'container'>
			    	<div className = 'row'>
						<RenderDish dish = {props.dish} />
						<RenderComments
							comments = {props.comments}
							postComment={props.postComment}
							dishId = {props.dish.id}
						/>
			    	</div>
				</div>
			</div>
		)
	}


const minLength = (min) => (val) => val && val.length >= min
const maxLength = (max) => (val) => !val || val.length < max
const required = (val) => val && val.length

class CommentForm extends Component {

	constructor (props) {
		super (props)
		this.state = {
			isModalOpen: false
		}
		this.toggleModal = this.toggleModal.bind(this)
		this.handleAddComment = this.handleAddComment.bind(this)
	}

	toggleModal () {
		this.setState ({
			isModalOpen: !this.state.isModalOpen
		})
	}

	handleAddComment (values) {
		this.toggleModal()
		this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
	}

	render(){
		return (
			<div>
				<Button outline onClick = {this.toggleModal}><span className = 'fa fa-pencil fa-lg'></span> Add Comment</Button>
				<Modal isOpen = {this.state.isModalOpen} toggle = {this.toggleModal} >
					<ModalHeader toggle = {this.toggleModal} >Submit Comment</ModalHeader>
					<LocalForm  className = 'container' onSubmit = {(values) => {this.handleAddComment(values)} }>
						<ModalBody>
							<Row className = 'form-group'>
								<Col sm = {12}><Label htmlFor = 'rating'>Rating</Label></Col>
								<Col sm = {12}>
									<Control.select className = 'form-control' type = 'number'
										model = '.rating' id = 'rating' name = 'rating' min = '0' max = '5' defaultValue = {5}
									>
										<option value='1'>1</option>
										<option value='2'>2</option>
										<option value='3'>3</option>
										<option value='4'>4</option>
										<option value='5'>5</option>
									</Control.select>
								</Col>
							</Row>
							<Row className = 'form-group'>
								<Col sm = {12}><Label htmlFor = 'name'>Your Name</Label></Col>
								<Col sm = {12}>
									<Control.text className = 'form-control' model = '.name'
										id = 'name' name = 'name' placeholder = 'Your Name'
										validators = {{
											minLength: minLength(3),
											maxLength: maxLength(15)
										}}
									/>
								</Col>
								<Col col = {12}>
									<Errors model = '.name' show = 'touched' className='text-danger'
										messages = {{
											minLength: 'Must be greater than 2 characters',
											maxLength: 'Must be less than 15 characters'
										}}
									/>
								</Col>
							</Row>
							<Row className = 'form-group'>
								<Col sm = {12}><Label htmlFor = 'comment'>Comment</Label></Col>
								<Col sm = {12}>
									<Control.textarea className = 'form-control' rows ='6'
										model = '.comment' id = 'comment' name = 'comment'
										validators = {{
											required
										}}
									/>
								</Col>
								<Col>
									<Errors model = '.comment' show='touched' className='text-danger'
										messages = {{
											required: 'This field is required'
										}}
									/>
								</Col>
							</Row>
						</ModalBody>
						<ModalFooter>
							<Button color='primary'>Submit</Button>
						</ModalFooter>
					</LocalForm>
				</Modal>
			</div>
		)
	}
}


export default DishDetail