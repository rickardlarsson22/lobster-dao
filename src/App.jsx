import { useAddress, useNetwork ,ConnectWallet, useContract, useNFTBalance, Web3Button } from "@thirdweb-dev/react";
import { useState, useEffect, useMemo } from "react";
import { ChainId } from "@thirdweb-dev/sdk";

import { AddressZero } from "@ethersproject/constants";

const App = () => {

  const address = useAddress();
  console.log("User address: ", address);

  const network = useNetwork();
  console.log("Network: ", network);

  const editionDropAddress = "0x7ee024c570ACf872F26BE98f54ae8c654DECbBBF"
  const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop");
  const { contract: token } = useContract("0x6a83B4F1ce11EA19F30Aa6fb5b1B6EA302C24151", "token");
  const { contract: vote } = useContract("0x77699361063383addBb78a0870B88c7bB1d6cdF3", "vote");

  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0");

  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0)
  }, [nftBalance])

  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  const [memberAddresses, setMemberAddresses] = useState([]);

  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log("Proposals: ", proposals);
      } catch (error) {
        console.log("Failed to get proposals", error);
      }
    };
    getAllProposals();
  }, [hasClaimedNFT, vote]);

  

  useEffect(() => {
    if(!hasClaimedNFT) {
      return;
    }

    if (!proposals.length) {
      return;
    }

    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log("User has already voted");
        } else {
          console.log("User has not voted yet");
        }
      } catch (error) {
        console.error("Failed to check if wallet has voted", error);
      }
    };
    checkIfUserHasVoted();
  }, [hasClaimedNFT, proposals, address, vote]);



  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop?.history.getAllClaimerAddresses(0,);
        setMemberAddresses(memberAddresses);
        console.log("Member addresses", memberAddresses);
      } catch (error) {
        console.error("Failed to get member addresses", error);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop?.history]);



  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token?.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("Member token amounts", amounts);
      } catch (error) {
        console.error("Failed to get member token amounts", error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token?.history]);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {

      const member = memberTokenAmounts?.find(({ holder }) => holder === address);

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  
  if (address && (network?.[0].data.chain.id !== ChainId.Goerli)) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Goerli</h2>
        <p>
          This Dapp only works on the Goerli network. Please switch to connect wallet.
        </p>
      </div>
    );
  }


  if (!address) {
    return (
      
      <div className="landing">
        <h1>Welcome to LobsterDAO</h1>
        <div className="btn-hero">
          <ConnectWallet />
        </div>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>DAO Member Page</h1>
        <p>Join the revolution!</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active Proposals</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();

              setIsVoting(true);

              const votes = proposals.map((proposals) => {
                const voteResult = {
                  proposalId: proposals.proposalId,
                  vote: 2,
                };

                proposals.votes.forEach((vote) => {
                  const elem = document.getElementById(
                    proposals.proposalId + "-" + vote.type,
                  );

                  if (elem.checked) {
                    voteResult.vote = vote.type;
                    return;
                  }
                });

                return voteResult;
              })


              try {

                const delegation = await token.getDelegationOf(address);
                
                if (delegation === AddressZero) {
                  await token.delegateTo(address);
                }

                try {

                  await Promise.all(
                    votes.map(async ({ proposalId, vote: _vote }) => {

                      const proposal = await vote.get(proposalId);

                      // 1 = open
                      if (proposal.state === 1) {
                        return vote.vote(proposalId, _vote);
                      }

                      return;
                    }),
                  );

                  try {

                    await Promise.all(
                      votes.map(async ({ proposalId }) => {

                        const proposal = await vote.get(proposalId);

                        // 4 = ready to execute
                        if(proposal.state === 4) {
                          return vote.execute(proposalId);
                        }
                      }),
                    );

                    setHasVoted(true);

                    console.log("Successfully voted");
                  } catch (err) {
                    console.error("Failed to execute votes", err);
                  }
                } catch (err) {
                  console.error("Failed to vote");
                }
              } catch (err) {
                console.error("Failed to delegate tokens");
              } finally {

                setIsVoting(false);
              }
            }}
          >
            {proposals.map((proposal) => (
              <div key={proposal.proposalId} className="card">
                <h5>{proposal.description}</h5>
                <div>
                  {proposal.votes.map(({ type, label }) => (
                    <div key={type}>
                      <input
                        type= "radio"
                        id= {proposal.proposalId + "-" + type}
                        name= {proposal.proposalId}
                        value= {type}
                        defaultChecked= {type === 2}
                      ></input>
                      <label htmlFor={proposal.proposalId + "-" + type}>
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button disabled={isVoting || hasVoted} type="submit">
              {isVoting
                ? "Voting..."
                : hasVoted
                ? "You already voted"
                :"Submit Votes"
                }
            </button>
            {!hasVoted && (
              <small>
                This will trigger multiple transaction. Please sign to validate your votes.
              </small>
            )}
          </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mint-nft">
      <h1>Mint your free DAO Membership NFT</h1>
      <div className="btn-hero">
        <Web3Button
          contractAddress={editionDropAddress}
          action={contract => {
            contract.erc1155.claim(0, 1)
          }}
          onSuccess={() => {
            console.log(`Successfully minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
          }}
          onError={error => {
            console.error("Failed to mint NFT", error);
          }}
          >Mint your NFT (FREE)</Web3Button>
      </div>
    </div>
  );
}

export default App;
