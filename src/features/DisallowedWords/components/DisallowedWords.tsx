import type { FC } from 'react'

import {
  Badge,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Heading,
  Icon,
  ProgressCircle
} from '@adobe/react-spectrum'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BiX } from 'react-icons/bi'
import { FaBan } from 'react-icons/fa'

import { DisallowedWordService } from '../api'
import { DisallowedWordForm } from './DisallowedWordForm'

export const DisallowedWords: FC = () => {
  const queryClient = useQueryClient()

  const wordsQuery = useQuery({
    queryKey: [DisallowedWordService.QueryKey.GetAll, { page: 1, limit: 10000 }],
    queryFn: DisallowedWordService.getWords
  })
  const words = wordsQuery.data?.data?.data ?? []

  const createWord = useMutation({
    mutationFn: DisallowedWordService.createWord
  })
  const deleteWord = useMutation({
    mutationFn: DisallowedWordService.deleteWord
  })

  return (
    <DialogTrigger>
      <Button
        variant="negative"
        UNSAFE_className="px-4! gap-2 ml-auto!"
      >
        <Icon>
          <FaBan className="size-5!" />
        </Icon>
        Disallowed Words
      </Button>
      {(close) => (
        <Dialog width="size-6000">
          <Heading level={2}>Add word</Heading>
          <Divider />
          <Content>
            <div>
              <ul className="flex items-center gap-2 flex-wrap mb-4">
                {wordsQuery.isLoading ? (
                  <div className="mx-auto">
                    <ProgressCircle isIndeterminate />
                  </div>
                ) : words?.length ? (
                  words.map((word) => (
                    <li key={word.id}>
                      <Badge variant="neutral">
                        <div className="flex items-center">
                          <span className="px-2">{word.word}</span>
                          <button
                            className="size-6 bg-white/20 mr-2 rounded-full grid place-items-center hover:bg-rose-500 transition-colors disabled:opacity-50"
                            disabled={deleteWord.isPending}
                            onClick={() => {
                              deleteWord.mutateAsync(word.id).then(() => {
                                wordsQuery.refetch()
                              })
                            }}
                          >
                            {deleteWord.isPending && deleteWord.variables === word.id ? (
                              <ProgressCircle
                                size="S"
                                isIndeterminate
                                staticColor="white"
                              />
                            ) : (
                              <BiX className="size-5" />
                            )}
                          </button>
                        </div>
                      </Badge>
                    </li>
                  ))
                ) : (
                  <p className="mx-auto opacity-60">No disallowed words found.</p>
                )}
              </ul>
            </div>
            <DisallowedWordForm
              isPending={createWord.isPending}
              onSubmit={async (values, form) => {
                await createWord.mutateAsync(values)
                queryClient.invalidateQueries({
                  queryKey: [DisallowedWordService.QueryKey.GetAll]
                })
                form.reset()
              }}
              actions={(form) => (
                <ButtonGroup alignSelf="end">
                  <Button
                    variant="secondary"
                    onPress={close}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="cta"
                    isDisabled={!form.formState.isDirty}
                    isPending={createWord.isPending || wordsQuery.isLoading}
                  >
                    Create
                  </Button>
                </ButtonGroup>
              )}
            />
          </Content>
        </Dialog>
      )}
    </DialogTrigger>
  )
}
