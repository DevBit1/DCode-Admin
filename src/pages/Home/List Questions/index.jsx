import React, { useCallback, useEffect, useState } from 'react'
import PaginationComponent from '../../../Components/Common/PaginationComponent'
import TableComponent from '../../../Components/Home Components/List Questions/Table'
import TableHeader from "../../../Components/Home Components/List Questions/TableHeader"
import debounce from '../../../Constants/debounce'
import tableSchema from "../../../Constants/Tables/questionTableSchema"
import apiConnect from '../../../Utils/ApiConnector'
import { asyncWrapper } from '../../../Utils/asyncWrapper'


const ListQuestions = () => {

  const [questions, setQuestions] = useState([])
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [search, setSearch] = useState("")
  const [tags, setTags] = useState([]) // To store the tags selected by us
  const [totalPages, setTotalPages] = useState(1)
  const [difficulty, setDifficulty] = useState("")



  const [loading, setLoading] = useState(true)


  const fetchQuestions = useCallback(debounce(
    asyncWrapper(
      async (page = 1, perPage = 10, search = "", tags = [], difficulty = "") => {
        try {
          setLoading(true)
          const response = await apiConnect("get", `/admin/questions`, null, null, { page: page, limit: perPage, search: search, tags: tags.join(","), difficulty })

          setQuestions(response.data.result)
          setTotalPages(response.data.totalPages)
        } catch (error) {
          throw new Error(`Error while accessing all the questions : ${error.response?.data.message || error.message}`)
        }
        finally {
          setLoading(false)
        }
      }
    )
    , 300), [])




  const handlePageChange = (val) => {
    if (Number(val)) {
      setPage(val)
    }
  }

  const handlePerPageChange = (val) => {
    setPerPage(val)
    setPage(1)
  }


  const handleSearchChange = (val) => {
    setSearch(val)
    setPage(1)
  }

  const handleTagChange = (val) => {
    setTags(val)
    setPage(1)
  }

  const handleDifficulty = (val) => {
    setDifficulty(val)
    setPage(1)
  }




  useEffect(() => {
    fetchQuestions(page, perPage, search, tags, difficulty)
  }, [page, perPage, search, tags, difficulty])





  return (
    <div className='max-w-full mx-auto flex flex-col h-full py-3 md:px-2 sm:px-10 overflow-y-auto'>
      <TableHeader
        perPage={perPage}
        search={search}
        tags={tags}
        difficulty={difficulty}
        handlePerPageChange={handlePerPageChange}
        handleSearchChange={handleSearchChange}
        handleTagChange={handleTagChange}
        handleDifficulty={handleDifficulty}
      />
      <TableComponent
        tableCol={tableSchema}
        data={questions}
        loading={loading}
      />
      <PaginationComponent
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        page={page}
        showFirstButton={true}
        showLastButton={true}
      />
      {/* Hello */}
    </div>
  )
}

export default ListQuestions