"use client"
import { useApproveAdsItem, useGetAdsListQuery, useRejectAdsItem, useRemoveAds } from '@/_redux/services/adsApi'
import { ActionIcon, Button, Flex, Loader, Modal, Pagination, Popover, Table, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconTrash, IconXboxX } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';

const ClientAds = () => {
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [openedDescription, { open, close }] = useDisclosure(false);
  const [descriptionTitle, setDescriptionTitle] = useState('')
  const { data, isLoading, isSuccess } = useGetAdsListQuery({ page: currentPage })
  const [opened, setOpened] = useState<{ [key: number]: boolean }>({});
  const [openedImageModal, setOpenedImageModal] = useState(false);

  const [approve, { isSuccess: isSuccessApprove }] = useApproveAdsItem();
  const [reject, { isSuccess: isSuccessReject }] = useRejectAdsItem();
  const [remove, { isSuccess: isSuccessRemove }] = useRemoveAds()
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const acceptAds = (id: number) => {
    if (id) {
      approve({ id })
    }
  }

  const rejectAds = (id: number) => {
    if (id) {
      reject({ id })
    }

  }
  const removeAds = (id: number) => {
    if (id) {
      remove(id)
    }
  }

  useEffect(() => {
    if (isSuccessApprove) {
      notifications.show({
        color: 'green',
        title: 'با موفقیت تایید شد',
        message: '',
      })
    }
  }, [isSuccessApprove])

  useEffect(() => {
    if (isSuccessReject) {
      notifications.show({
        color: 'green',
        title: 'با موفقیت رد شد',
        message: '',
      })
    }
  }, [isSuccessReject])

  useEffect(() => {
    if (isSuccessRemove) {
      notifications.show({
        color: 'green',
        title: 'با موفقیت حذف شد',
        message: '',
      })
    }
  }, [isSuccessRemove])

  const handleOpen = (id: number) => {
    setOpened((prevState) => ({ ...prevState, [id]: true }));
  };

  const handleClose = (id: number) => {
    setOpened((prevState) => ({ ...prevState, [id]: false }));
  };

  const handleImageAds = (image: string | undefined, title: string) => {
    if (image) {
      const images: string[] = JSON.parse(image);
      return (
        <>
          {images.map((img, index) => (
            <Image
              key={index} // Ensure to add a key when mapping elements
              alt={title}
              width={30}
              onClick={() => openModal(img)} // Opens modal on click
              height={30}
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${img}`}
            />
          ))}
        </>
      );

    } else {
      return (
        <></>
      )
    }
  }

  const openModal = (img: string) => {
    setSelectedImage(`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${img}`);
    setOpenedImageModal(true);
  };


  const rows = data?.data.map((product) => (
    <Table.Tr key={product.id}>
      <Table.Td>{product.id}</Table.Td>
      <Table.Td>{product.title}</Table.Td>
      <Table.Td>
        {handleImageAds(product.image, product.title)}
      </Table.Td>

      <Table.Td onClick={() => { setDescriptionTitle(product.description); open() }}><Text fz='sm' lineClamp={1}>{product.description}</Text></Table.Td>
      <Table.Td>{product.category.name}</Table.Td>
      <Table.Td>{product.user.username}</Table.Td>
      <Table.Td>{new Intl.NumberFormat('fa-IR').format(Number(product.price))}</Table.Td>
      <Table.Td>{product.status === 'approved' ? <Text fz={'xs'} c={'green'}>Approved</Text> : <Text fz={'xs'} c={'red'}>Pending</Text>}</Table.Td>
      <Table.Td>{product.city}</Table.Td>
      <Table.Td>
        <Flex>
          <ActionIcon onClick={() => acceptAds(product.id)} variant='light' ml={'lg'}>
            <IconCheck size={17} />
          </ActionIcon>
          <ActionIcon onClick={() => rejectAds(product.id)} variant='light' color='orange'>
            <IconXboxX size={17} />
          </ActionIcon>
          <Popover opened={opened[product.id] || false}
            onClose={() => handleClose(product.id)} width={200} position="bottom" withArrow shadow="md" >
            <Popover.Target>
              <ActionIcon onClick={() => handleOpen(product.id)} mr={'lg'} variant='light' color='red'>
                <IconTrash size={17} />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="xs">آیا از حذف این آیتم مطمن هستید</Text>
              <Flex justify={'flex-end'} mt={'sm'}>
                <Button ml={'sm'} color={'red'} variant='light' size='xs' onClick={() => removeAds(product.id)}>بله</Button>
                <Button variant='light' size='xs' onClick={() => handleClose(product.id)} >خیر</Button>
              </Flex>
            </Popover.Dropdown>
          </Popover>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));
  const totalPages = data?.last_page || 1;

  return (
    <div>
      {isLoading ? (
        <Loader size="lg" /> // Show loading spinner while data is fetching
      ) : isSuccess && data?.data.length > 0 ? (
        <>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>#</Table.Th>
                <Table.Th>عنوان</Table.Th>
                <Table.Th>تصاویر</Table.Th>
                <Table.Th>توضیحات</Table.Th>
                <Table.Th>دسته بندی</Table.Th>
                <Table.Th>کاربر</Table.Th>
                <Table.Th>قیمت</Table.Th>
                <Table.Th>وضعیت</Table.Th>
                <Table.Th>شهر</Table.Th>
                <Table.Th> </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows}
            </Table.Tbody>
          </Table>

          {/* Mantine Pagination */}
          <Pagination
            mt="lg"
            total={totalPages}
            value={currentPage}
            onChange={handlePageChange}
          />
          <Modal size={'xl'} opened={openedDescription} onClose={close} title="">

            <div style={{ whiteSpace: 'pre-wrap' }}>
              {descriptionTitle}
            </div>
          </Modal>

          <Modal
            opened={openedImageModal}
            onClose={() => setOpenedImageModal(false)}
            centered
            size="auto" // Adjust the size automatically based on content
          >
            {selectedImage && (
              <Image
                src={selectedImage}
                alt={''}
                width={600}
                height={600}
                />
            )}
          </Modal>
        </>
      ) : (
        <Text >No products found.</Text>
      )}
    </div>
  )
}

export default ClientAds