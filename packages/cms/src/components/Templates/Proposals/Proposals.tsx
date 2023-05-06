import {
  Grid,
  Divider,
  Tooltip,
  IconButton,
  Typography,
  Stack,
  Pagination,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableSortLabel,
  Box,
  Modal,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  InputAdornment,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import * as S from "./Proposals.style";
import { useNavigate } from "react-router-dom";
import { verifyAccess } from "../../../utils/verifyAccess";
import LoadingBar from "../../Organisms/LoadingBar";
import ProposalRowTemplate from "../../Molecules/TableRowProposal/ProposalRow";
import { useFormik } from "formik";
import * as Yup from "yup";
import MyGrid from "../../Molecules/MyGrid";
import {
  UpdateProposal,
  CreateProposal,
  DeleteProposal,
  ListProposal,
} from "../../../services/proposal";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { LoadingButton } from "@mui/lab";

const initialValues = {
  id: null,
  name: "",
  type: "Landing Page",
  clientId: null,
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: "500px",
  bgcolor: "background.paper",
  borderRadius: "4px",
  boxShadow: 24,
  padding: "14px",
};

function ProposalsTemplate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listProposal, setListProposal] = useState<any>([]);
  const [countProposal, setCountProposal] = useState<any>(-1);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [getPermissionUser, setPermissionUser] = useState<any>();
  const [showModal, setShowModal] = useState(false);
  const [actionModal, setActionModal] = useState<string>("");
  const [listClient, setListClient] = useState<any>([
    {
      id: 1,
      name: "Client 1",
      contact: "01234567890",
      document: "01345.89012",
      state: "PR",
      zipCode: "PR",
      city: "Cornélio Procópio",
      avatarImg: "R.Teste | 00 | Vila Teste",
      address: "default_avatar.jpg",
      createdAt: "2023-04-29 13:49:23.557",
    },
  ]);

  const submitRequest = useCallback(
    (values: typeof initialValues) => {
      const temp = {
        name: values.name,
        type: values.type,
        clientId: values.clientId,
      };
      const createUser = async () => {
        try {
          setLoading(true);
          if (!values.id) {
            await CreateProposal(temp);
            console.log(actionModal)
          } else {
            await UpdateProposal({ ...temp, id: values.id });
            console.log(actionModal)
          }
          formik.values.name = "";
          formik.values.clientId = null;

          setLoading(true);
          const temp1 = await verifyAccess();
          const data = await ListProposal({
            page: page,
            perPage: rowsPerPage,
            search: search,
          });
          setPermissionUser(temp1);
          setListProposal(data.data);
          setCountProposal(data.total);
        } catch (e) {
          console.log(e);
        } finally {
          setShowModal(false);
          setLoading(false);
        }
      };

      createUser();
    },
    // [loading],
    []
  );

  const formik = useFormik({
    initialValues,
    onSubmit: submitRequest,
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required("* Campo obrigatório")
        .min(4, "* Email deve conter pelo menos 4 caracteres")
        .max(50, "* Email deve conter no máximo 50 caracteres"),
      type: Yup.string()
        .required("* Campo obrigatório")
        .oneOf(["Landing Page", null], "* Senhas devem ser iguais"),
      clientId: Yup.number().required("* Campo obrigatório"),
    }),
  });

  interface OpenModalInterface {
    action: string;
    row?: any;
  }

  const handleOpenModal = ({ action, row }: OpenModalInterface) => {
    setShowModal(true);
    if (action.toUpperCase() !== "EDITAR") {
      formik.values.name = "";
      formik.values.clientId = null;
      formik.values.id = null
    } else {
      formik.values.name = row?.name;
      formik.values.clientId = row?.client.id;
      formik.values.id = row?.id;
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    formik.values.name = "";
    formik.values.clientId = null;
  };

  async function handleOrder(entry: string) { }

  const handleDeleteProposal = async (id: number) => {
    if (listProposal) {
      try {
        setLoading(true);
        await DeleteProposal({ id: id });
        const data = await ListProposal({
          page: page,
          perPage: rowsPerPage,
          search: "",
        });
        setListProposal(data.data);
        setCountProposal(data.total);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await ListProposal({
        page: page,
        perPage: rowsPerPage,
        search: search,
      });
      setListProposal(data.data);
      setCountProposal(data.total);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = async (event: unknown, newPage: number) => {
    setPage(newPage);
    try {
      setLoading(true);
      const data = await ListProposal({
        page: newPage + 1,
        perPage: rowsPerPage,
        search: search,
      });
      setListProposal(data.data);
      setCountProposal(data.total);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRowsPerPage = async (event: any) => {
    setRowsPerPage(event);
    setPage(1);
    try {
      setLoading(true);
      const data = await ListProposal({
        page: 1,
        perPage: event,
        search: search,
      });
      setListProposal(data.data);
      setCountProposal(data.total);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const temp = await verifyAccess();
        const data = await ListProposal({
          page: page,
          perPage: rowsPerPage,
          search: search,
        });
        setPermissionUser(temp);
        setListProposal(data.data);
        setCountProposal(data.total);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <Grid sx={{ padding: "0px 12px", overflow: "auto" }}>
        <S.ListProposalGrid>
          <Grid
            padding={"16px 24px"}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid
              display="flex"
              alignItems="flex-start"
              flexDirection={"column"}
            >
              <S.ListProposalTitle>Propostas</S.ListProposalTitle>
              <S.ListProposalDescription>
                Lista de propostas
              </S.ListProposalDescription>
            </Grid>
            <Grid marginRight={"12px"}>
              {getPermissionUser?.proposal?.create && (
                <Tooltip title="Adicionar proposta" color="">
                  <IconButton
                    onClick={() => {
                      handleOpenModal({ action: "Criar" });
                    }}
                    edge="end"
                    size="large"
                    color="primary"
                  >
                    <AddIcon sx={{ width: "24px", height: "24px" }} />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
          </Grid>
          <Divider />
          <Grid
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            padding={"16px 24px"}
          >
            <Grid
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              gap={"10px"}
            >
              <FormControl>
                <Select
                  sx={{ height: "33px" }}
                  labelId="rowsPerPage"
                  id="rowsPerPageId"
                  value={rowsPerPage}
                  onChange={(e) => {
                    handleChangeRowsPerPage(e.target.value);
                  }}
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={30}>30</MenuItem>
                </Select>
              </FormControl>
              <Typography>Entradas por página</Typography>
            </Grid>
            <Grid>
              <S.ListProposalSearch
                sx={{ m: 1, width: "25ch" }}
                variant="outlined"
              >
                <InputLabel htmlFor="search">Buscar</InputLabel>
                <OutlinedInput
                  id="search"
                  type={"text"}
                  value={search}
                  onChange={(e) => {
                    const temp = e.target.value;
                    setSearch(temp);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleSearch}
                        edge="end"
                        size="small"
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Buscar"
                />
              </S.ListProposalSearch>
            </Grid>
          </Grid>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-end"
            padding={"16px 24px"}
            width={"900px"}
          >
            <TableContainer>
              {loading ? (
                <LoadingBar />
              ) : (
                <Table stickyHeader>
                  <TableHead>
                    <TableRow style={{ height: 33 }}>
                      <S.ListProposalTableCell align={"left"}>
                        <TableSortLabel onClick={(e) => handleOrder("id")}>
                          #id
                        </TableSortLabel>
                      </S.ListProposalTableCell>
                      <S.ListProposalTableCell align={"left"}>
                        <TableSortLabel onClick={(e) => handleOrder("text")}>
                          Nome
                        </TableSortLabel>
                      </S.ListProposalTableCell>
                      <S.ListProposalTableCell align={"left"}>
                        <TableSortLabel onClick={(e) => handleOrder("text")}>
                          Tipo
                        </TableSortLabel>
                      </S.ListProposalTableCell>
                      <S.ListProposalTableCell align={"left"}>
                        <TableSortLabel onClick={(e) => handleOrder("text")}>
                          Contato
                        </TableSortLabel>
                      </S.ListProposalTableCell>
                      <S.ListProposalTableCell align={"center"}>
                        <TableSortLabel
                          onClick={(e) => handleOrder("createdAt")}
                        >
                          Data
                        </TableSortLabel>
                      </S.ListProposalTableCell>
                      {(getPermissionUser?.proposal?.update ||
                        getPermissionUser?.proposal?.delete) && (
                          <S.ListProposalTableCell align={"center"}>
                            Ações
                          </S.ListProposalTableCell>
                        )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listProposal.map((row: any, i: number) => {
                      return (
                        <ProposalRowTemplate
                          key={`user-row-${row.id}`}
                          index={i}
                          id={row?.id}
                          name={row.name}
                          type={row.type}
                          canEdit={getPermissionUser?.proposal?.update}
                          canDelete={getPermissionUser?.proposal?.delete}
                          client={row?.client || ""}
                          contact={row?.client?.contact || ""}
                          createdAt={row.createdAt}
                          onDelete={() => {
                            handleDeleteProposal(row.id);
                          }}
                          onEdit={(val) => {
                            handleOpenModal({action: "Editar", row});
                          }}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Grid>
          <Divider sx={{ margin: "0px 24px" }} />
          <Grid
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            padding={"16px 24px 32px 24px"}
          >
            <Typography>
              Mostrando {page} de{" "}
              {rowsPerPage > countProposal ? countProposal : rowsPerPage} de um
              total de {countProposal}
            </Typography>
            <Stack spacing={2}>
              <Pagination
                hidePrevButton={page == 1}
                hideNextButton={page == Math.round(countProposal / rowsPerPage)}
                count={Math.round(countProposal / rowsPerPage)}
                shape="rounded"
                onChange={(e, p) => {
                  handleChangePage(e, p);
                }}
              />
            </Stack>
          </Grid>
        </S.ListProposalGrid>
      </Grid>

      <Modal
        open={showModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={formik.handleSubmit}>
          <Grid sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {`${actionModal} proposta`}
            </Typography>
            <Grid
              container
              spacing={3}
              alignItems="flex-start"
              sx={{
                width: "100%",
                margin: 0,
              }}
            >
              <MyGrid item xs={12}>
                <S.NewUserTextField
                  fullWidth
                  label="Nome"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.name && formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  inputProps={{ maxLength: 50 }}
                />
              </MyGrid>
              <MyGrid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="typelabel">Tipo do projeto</InputLabel>
                  <Select
                    labelId="typelabel"
                    id="type"
                    name="type"
                    value={formik.values.type}
                    defaultValue={formik.values.type}
                    onChange={(e) => {
                      const temp = e.target.value;
                      formik.setFieldValue("type", temp);
                    }}
                    input={<OutlinedInput label="Tipo do projeto" />}
                    style={{ textAlign: "start" }}
                    error={Boolean(formik.touched.type && formik.errors.type)}
                    inputProps={{ readOnly: true }}
                  >
                    <MenuItem
                      value={"Landing Page"}
                      sx={{ textTransform: "capitalize" }}
                    >
                      {"Landing Page"}
                    </MenuItem>
                  </Select>
                  {Boolean(formik.touched.type && formik.errors.type) && (
                    <FormHelperText error style={{ marginLeft: 0 }}>
                      {formik.touched.type && formik.errors.type}
                    </FormHelperText>
                  )}
                </FormControl>
              </MyGrid>
              <MyGrid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="clientIdlabel">Cliente</InputLabel>
                  <Select
                    labelId="clientIdlabel"
                    id="clientId"
                    name="clientId"
                    value={formik.values.clientId}
                    defaultValue={formik.values.clientId}
                    onChange={(e) => {
                      const temp = e.target.value;
                      formik.setFieldValue("clientId", temp);
                    }}
                    input={<OutlinedInput label="Cliente" />}
                    style={{ textAlign: "start" }}
                    error={Boolean(
                      formik.touched.clientId && formik.errors.clientId
                    )}
                  >
                    {listClient.map((item: any, i: number) => {
                      return (
                        <MenuItem key={item?.id + i} value={item?.id}>
                          {item?.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {Boolean(
                    formik.touched.clientId && formik.errors.clientId
                  ) && (
                      <FormHelperText error style={{ marginLeft: 0 }}>
                        {formik.touched.clientId && formik.errors.clientId}
                      </FormHelperText>
                    )}
                </FormControl>
              </MyGrid>
              <LoadingButton
                loading={loading}
                type="submit"
                variant="contained"
                sx={{
                  marginTop: "24px",
                }}
              >
                {`${actionModal} proposta`}
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Modal>
    </>
  );
}

export default ProposalsTemplate;
