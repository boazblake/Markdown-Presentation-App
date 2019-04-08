import m from 'mithril'
import Stream from 'mithril-stream'
import { clone, filter, propEq, prop, without, concat, head, sortBy } from 'ramda'
import SlidesModal from './slidesModal.js'
import Slide from './Slide/component.js'
import Preview from './Preview/component.js'
import { loadSlides } from './model.js'
import { log } from '../services/index.js'


const Slides = ({ attrs: { Models } }) => {
	const state = {
		left: Stream([]),
		right: Stream([]),
		slideDrag: {
			dragId: '',
			dragging: false,
			droppable: false,
		},
		previewDrag: {
			drag: null,
			drop: null,
		},
		presentationId: '',
	}

	const onError = log('error')

	const onSuccess = (presentation) => {
		let slides = Models.CurrentPresentation.Slides

		state.left(filter(propEq('order', 0), slides))

		state.right(sortBy(prop('order'), without(state.left(), slides)))

		Models.CurrentPresentation.slideShow = Stream(state.right())
	}

	const getSlides = ({ attrs: { Models } }) => {
		state.presentationId = m.route.param('id')
		return loadSlides(state.presentationId)(Models).fork(onError, onSuccess)
	}

	const handleDragEnter = (ev) => {
		ev.preventDefault()
		state.bColor = true
	}

	const handleDragLeave = (ev) => {
		ev.preventDefault()
		state.slideDrag.dragging = false
		state.slideDrag.droppable = false
		state.bColor = false
	}

	const handleDrop = (ev) => {
		ev.preventDefault()
		let type = ev.dataTransfer.getData('text/plain')
		if (state.slideDrag.dragging) {
			if (type == 'slide') {
				let item = head(filter(propEq('id', state.slideDrag.dragId), state.left()))
				state.slideDrag.droppable = true
				item.order = state.right().length + 1
				state.left(without([ item ], state.left()))
				state.right(concat(state.right(), [ item ]))
			} else {
				let item = head(filter(propEq('id', state.slideDrag.dragId), state.right()))
			}
		}
	}

	const handleDragOver = (ev) => {
		ev.preventDefault()
		let type = ev.dataTransfer.getData('text/plain')
		state.slideDrag.dragging = true
		ev.dataTransfer.dropEffect = 'move'
	}

	return {
		oninit: getSlides,
		view: ({ attrs: { Models } }) => [
			Models.toggleModal
				? m(SlidesModal, {
						toggleModal: () => (Models.toggleModal = !Models.toggleModal),
						left: state.left,
						slide: clone(Models.SlideModel),
						getSlides,
						Models,
						pId: state.presentationId,
					})
				: '',
			m('.container', [
				m(
					'aside.left-drag',
					{
						onBeforeRemove: (vnode, done) => {
							vnode.dom.addEventListener('animationend', done)
							vnode.dom.style.animation = 'fadeOut 1s'
						},
					},
					[
						state.left().map((s) =>
							m(Slide, {
								key: s.id,
								Models,
								getSlides,
								s,
								state,
							})
						),
					]
				),

				m(
					`section.right-drag${state.slideDrag.dragging ? '.isDragging' : ''}`,
					{
						onBeforeRemove: (vnode, done) => {
							vnode.dom.addEventListener('animationend', done)
							vnode.dom.style.animation = 'fadeOut 1s'
						},
						ondragleave: handleDragLeave,
						ondrop: handleDrop,
						ondragover: handleDragOver,
						ondragenter: handleDragEnter,
					},
					state.right().map((s) => {
						return m(Preview, {
							key: s.id,
							Models,
							getSlides,
							s,
							state,
						})
					})
				),
			]),
		],
	}
}

export default Slides
