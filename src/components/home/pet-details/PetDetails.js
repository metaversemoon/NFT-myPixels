import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import Card from '@material-ui/core/Card'
import Confetti from 'react-confetti'

import { StylesProvider } from '@material-ui/core/styles'
import {
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
} from '@material-ui/core'

import { apiKey } from '../../../'
import './PetDetails.css'
import { CircularStatic } from '../../commons/CircularProgressWithLabel'
import SeeMoreWork from '../see-more-work/SeeMoreWork'

function PetDetails({ account, contractData }) {
  const { petId } = useParams()
  const [petsData, setPetsData] = useState('')
  const [image, setPetImage] = useState([])
  const [petName, setPetName] = useState([])
  const [petOwner, setOwnerName] = useState([])
  const [petCategory, setPetCategory] = useState([])
  const [petTransactions, setpetTransactions] = useState([])
  const [comment, setComment] = useState('')
  const [codeHash, setCodeHash] = useState('')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unlock, setUnlock] = useState(false)

  const [greeting, set_greeting] = React.useState()
  const [winningNumber, setWinningNumber] = React.useState('')
  console.log('________________________', winningNumber)
  const [guessNumb, setGuessNumb] = React.useState('')
  const [feedbackMsg, setFeedbackMsg] = React.useState('')
  const [animation, setAnimation] = React.useState(false)

  const [winner, setWinner] = React.useState(false)

  const [showGame, setShowGame] = useState(false)

  useEffect(() => {
    // sets winnerNum
    setWinningNumber(Math.ceil(Math.random() * 20))

    const getImage = (ipfsURL) => {
      if (!ipfsURL) return
      ipfsURL = ipfsURL.split('://')
      return 'https://ipfs.io/ipfs/' + ipfsURL[1]
    }

    const resetGame = () => {
      window.location.reload()
    }

    const getMetadata = async () => {
      let data = await fetch(`https://ipfs.io/ipfs/${petId}/metadata.json`)
      data = await data.json()
      const [petOwner, petCategory] = data.description.split(',')
      const imageFormated = getImage(data.image)
      setPetImage(imageFormated)
      setPetName(data.name)
      setOwnerName(petOwner)
      setPetCategory(petCategory)
    }

    if (petId) {
      getMetadata()
      getImage()
    }
  }, [petId, contractData])

  const handleChange = (event) => {
    setInput(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(' state comment', comment)
    setComment(input)
    setInput('')
  }

  const checkGuessNumber = async (e) => {
    e.preventDefault()
    if (!guessNumb || guessNumb < 0 || guessNumb > 20) {
      setFeedbackMsg('Please enter a valid number from 0 to 20.')
    }

    let num1 = winningNumber
    let num2 = parseInt(guessNumb)

    if (num1 == num2) {
      try {
        setFeedbackMsg('🏆🏆 You Win! 🏆🏆 ')
        setWinner(true)
        setAnimation(true)

        // clean up notification again after 11 seconds
        setTimeout(() => {
          //  setShowNotification(false)
        }, 11000)
      } catch (e) {
        alert(
          'Something went wrong! ' +
            'Maybe you need to sign out and back in? ' +
            'Check your browser console for more info.',
        )
        throw e
      }
      return
    }

    const dif = Math.abs(num1 - num2)
    if (dif <= 3) {
      setFeedbackMsg("You're very close😌💭👍!")
      return
    }
    if (dif > 3 && dif <= 8) {
      setFeedbackMsg("You're lukewarm😊😊😊")
      return
    }
    if (dif > 10) {
      setFeedbackMsg("You're a bit chilly 😬 😬 😬")
      return
    }
  }

  let pet = {}
  if (petId === 'bafyreifathmuem47api3gwwxbo6lt4bewsfr2et7sfyv6dw5epkuv62ika') {
    pet = {
      name: 'Oliver',
      img: 'https://siasky.net/OADaRfw_nMqqXCz5NXXLq5xN6R3nScEKbzsRdqdEQrLL5A',
      type: 'Cat',
      Owner: 'Luis C',
      likes: 20,
      comments: [
        { author: 'Albert', content: 'This is awesome' },
        { author: 'Angie', content: 'So Cute~' },
      ],
    }
  }

  const checkConnect = async () => {
    if (!account) {
      alert('Please connect your wallet  to play!')
    } else {
      setShowGame(true)
    }
  }

  const mintNFT = async () => {
    try {
      const data = await contractData.methods
        .mintPetNFT(`https://${petId}`)
        .send({ from: account })

      console.log('data', data)
      setCodeHash(data)
    } catch (err) {
      console.error(err)
    }
  }

  const checkout = () => {
    window.unlockProtocol && window.unlockProtocol.loadCheckoutModal()
    window.addEventListener('unlockProtocol.status', function (event) {
      if (event.detail.state === 'unlocked') {
        alert('Worked!')
        setUnlock(true)
      }
    })
  }

  return (
    <StylesProvider injectFirst>
      <Container className="root-pet-details">
        {winner ? (
          <Confetti
            // width={width}
            // height={height}
            options={{ recycle: false }}
            recycle={false}
            tweenDuration={8000}
            numberOfPieces={500}
            gravity={0.1}
          />
        ) : (
          ''
        )}

        <div className="">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} className="grid-container">
              <div className="flex-container">
                <h2>{petName} </h2>
                <Button
                  variant="contained"
                  className="wallet-btn"
                  color="primary"
                  // onClick={ () => setShowGame(true)}
                  onClick={checkConnect}
                >
                  Play to win an NFT
                </Button>
              </div>

              <img className="img" src={image} alt="pet" />
              <div className="flex-container">
                <div>
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton>

                  <IconButton aria-label="share">
                    <ShareIcon />
                  </IconButton>
                </div>

                <Typography variant="body1" color="primary">
                  {pet?.likes ? pet.likes : 0} Likes
                </Typography>
              </div>

              <Typography
                gutterBottom
                variant="subtitle1"
                className="details-text"
              >
                Pet's Details
              </Typography>

              <Typography variant="body2" gutterBottom className="details-text">
                Full rights and credits to the owner @{petOwner}...
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Container>
                <div className="container1">
                  {/* show game */}
                  {showGame ? (
                    <div className="container1">
                      <h2 className="title2">
                        Dare to Play? Enter a number from 0 - 20
                      </h2>
                      <form className="form" noValidate autoComplete="off">
                        <TextField
                          id="outlined-basic"
                          label="Guess a number between 0 - 20"
                          variant="outlined"
                          className="text-field"
                          defaultValue={guessNumb}
                          type="number"
                          onChange={(e) => setGuessNumb(e.target.value)}
                        />

                        <Button
                          size="large"
                          variant="contained"
                          color="primary"
                          onClick={checkGuessNumber}
                        >
                          Go
                        </Button>
                      </form>
                    </div>
                  ) : (
                    ''
                  )}

                  <p className="feedbackMsg">{feedbackMsg}</p>

                  {winner ? (
                    <div>
                      <p>Congrats, You win an special NFT!!</p>
                      <Button
                        variant="contained"
                        className="wallet-btn2"
                        color="secondary"
                        onClick={mintNFT}
                      >
                        Mint NFT
                      </Button>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <br />

                {codeHash ? (
                  <Card className="code-hash">
                    <Typography gutterBottom variant="subtitle1">
                      Confirmation Transaction:
                    </Typography>
                    <p>
                      TransactionHash: <span>{codeHash.transactionHash}</span>{' '}
                    </p>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={
                        'https://mumbai.polygonscan.com/tx/' +
                        codeHash.transactionHash
                      }
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        className="wallet-btn"
                      >
                        See transaction
                      </Button>
                    </a>
                  </Card>
                ) : (
                  ''
                )}
              </Container>

              <form noValidate autoComplete="off">
                <TextField
                  id="outlined-basic"
                  label="Comment"
                  variant="outlined"
                  value={input}
                  onChange={handleChange}
                  className="text-field"
                />
              </form>
              <Button type="submit" variant="contained" onClick={handleSubmit}>
                Add comment
              </Button>
              {/* Display comments  */}
              {comment ? (
                <ListItem style={{ paddingLeft: '0px' }}>
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" />
                  </ListItemAvatar>
                  <ListItemText
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          className="inline"
                          color="textPrimary"
                        >
                          {account}
                        </Typography>
                        {` ${comment}`}
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ) : (
                <h2>No comments</h2>
              )}
            </Grid>
          </Grid>

          {/* <div onClick={checkout} style={{ cursor: 'pointer' }}>
            Unlock to see more work!{' '}
            <span aria-label="locked" role="img">
              🔒
            </span>
          </div> */}

          <SeeMoreWork
            petName={petName}
            unlock={unlock}
            setUnlock={setUnlock}
            checkout={checkout}
          />
        </div>
      </Container>
    </StylesProvider>
  )
}

export default PetDetails
